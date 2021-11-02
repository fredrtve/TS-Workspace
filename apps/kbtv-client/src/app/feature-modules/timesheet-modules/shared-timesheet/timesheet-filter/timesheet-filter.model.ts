import { Model, Timesheet } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { DataFilter } from '@shared/data.filter';
import { DateRange, _getStartOfDayTime, _isDateInDateRange } from 'date-time-helpers';
import { Immutable, Maybe, Prop, UnknownState } from 'global-types';
import { ForeignRelation, ModelConfig, _getModelConfig } from 'model/core';
import { TimesheetCriteria } from './timesheet-criteria.interface';

export class TimesheetFilter extends DataFilter<Timesheet, TimesheetCriteria>{

    private modelConfig: ModelConfig<ModelState, Timesheet>;

    constructor(criteria: Immutable<TimesheetCriteria>, maxChecks?: number){ 
        super(criteria, maxChecks);
        this.modelConfig = _getModelConfig<ModelState, Timesheet>("timesheets")
    }

    protected addChecks(record: Immutable<Timesheet>): boolean {
        let exp = true;
        
        if(!this.criteria.dateRange) return false;

        if(this.criteria.status){
            exp = exp && record.status === this.criteria.status;
            if(exp === false) return exp;
        }

        if(this.criteria.user?.userName){
            exp = exp && record.userName === this.criteria.user.userName;
            if(exp === false) return exp;
        }
        
        if(this.criteria.mission) {
            exp = exp && record.missionActivity?.missionId === this.criteria.mission.id;  
            if(exp === false) return exp;
        }

        if(this.criteria.activity) {
            exp = exp && record.missionActivity?.activityId === this.criteria.activity.id;  
            if(exp === false) return exp;
        }

        exp = exp && _isDateInDateRange(record.startTime, this.criteria.dateRange);

        return exp
    }

    //Check if criteria is contained in base, meaning all potential timesheets has already been fetched. 
    containedIn(baseCriteria: Immutable<TimesheetCriteria>): boolean{
        if(!this.criteria) return true;
        if(!baseCriteria) return false;
        if(!this.isDateRangeContainedIn(baseCriteria.dateRange)) return false;
        for(const prop in baseCriteria){
            if(prop === "dateRange" || prop === "dateRangePreset") continue;
            const baseValue = <UnknownState> baseCriteria[<Prop<Immutable<TimesheetCriteria>>> prop];
            if(!baseValue) continue; 
            const value =  <UnknownState> this.criteria[<Prop<Immutable<TimesheetCriteria>>> prop];
            if(value && typeof value === "object") {
                if(!this.isObjectContainedIn(baseValue, <Prop<Immutable<TimesheetCriteria>>> prop)) 
                    return false;
            }
            else if(value !== baseValue) return false;     
        }
        return true;
    }
    
    private isObjectContainedIn(baseValue: Immutable<UnknownState>, prop: Prop<TimesheetCriteria>): boolean{
        const fkRel = <ForeignRelation<ModelState, Timesheet, "user" | "missionActivity">> (<UnknownState>this.modelConfig.foreigns)[prop];
        const modelCfg = _getModelConfig<ModelState, Model>(fkRel.stateProp);
        const value = <UnknownState> this.criteria[prop];

        if(modelCfg && value[<string> modelCfg.idProp] !== baseValue[<string> modelCfg.idProp]) 
            return false

        if(!modelCfg && value !== baseValue) return false;
        
        return true
    }

    private isDateRangeContainedIn(baseDateRange: Maybe<Immutable<DateRange>>): boolean{
        if(!baseDateRange || !baseDateRange.end || !baseDateRange.start) return false; //No range means all, in which it will always be contained. 
        const dateRange = this.criteria.dateRange;
        if(!dateRange || !dateRange.start || !dateRange.end) return true; 
        return (_getStartOfDayTime(baseDateRange.start) <= _getStartOfDayTime(dateRange.start)) && 
        (_getStartOfDayTime(baseDateRange.end) >= _getStartOfDayTime(dateRange.end))
    }

};