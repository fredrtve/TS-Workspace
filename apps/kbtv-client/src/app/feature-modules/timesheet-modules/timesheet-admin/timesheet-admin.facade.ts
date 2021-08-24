import { Injectable } from '@angular/core';
import { modelCtx } from '@core/configurations/model/app-model-context';
import { Timesheet } from '@core/models';
import { LeaderSettings } from '@core/models/leader-settings.interface';
import { ModelState } from '@core/state/model-state.interface';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { _setFullNameOnUserForeigns } from '@shared-app/helpers/add-full-name-to-user-foreign.helper';
import { CreateTimesheetModelForm, EditTimesheetModelForm, TimesheetForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { WeekCriteriaFormState } from '@shared-timesheet/forms/week-criteria-controls.const';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { _noEmployersFilter } from '@shared-timesheet/no-employers-filter.helper';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { _find } from 'array-helpers';
import { Immutable, ImmutableArray, Maybe } from 'global-types';
import { ModelFormService } from 'model/form';
import { FetchModelsAction } from 'model/state-fetcher';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'state-management';
import { TimesheetSummary } from '../shared-timesheet/interfaces';
import { WeekCriteria } from '../shared-timesheet/interfaces/week-criteria.interface';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../shared-timesheet/timesheet-filter/timesheet-filter.model';
import { SetTimesheetCriteriaWithWeekCriteriaAction, SetSelectedWeekAction, UpdateTimesheetStatusesAction, UpdateLeaderSettingsAction } from './state/actions.const';
import { StoreState } from './store-state';

@Injectable({providedIn: 'any'})
export class TimesheetAdminFacade {

    users$ = this.store.selectProperty$("users").pipe(map(_noEmployersFilter));

    get selectedWeekNr(){ return this.store.state.timesheetAdminSelectedWeekNr; } 
    selectedWeekNr$ = this.store.selectProperty$("timesheetAdminSelectedWeekNr");

    get weekCriteria(){ return this.store.state.timesheetAdminWeekCriteria; } 
    weekCriteria$ = this.store.selectProperty$("timesheetAdminWeekCriteria");

    get leaderSettings(){ return this.store.state.leaderSettings; } 

    timesheetCriteria$ = this.store.selectProperty$("timesheetAdminTimesheetCriteria")

    weekCriteriaFormState$: Observable<WeekCriteriaFormState> = 
        this.users$.pipe(map(x => { return { users: x } } ))

    private _weeklySummaries$ = this.store.select$(['timesheets', 'timesheetAdminTimesheetCriteria']).pipe(
        map(x => <[ImmutableArray<Timesheet>, Immutable<TimesheetCriteria>]> [x.timesheets, x.timesheetAdminTimesheetCriteria]),
        filterRecords(TimesheetFilter), 
        map(x => _getSummariesByType(GroupByPeriod.Week, x.records))
    );

    weeklySummaries$ = combineLatest([this._weeklySummaries$, this.users$]).pipe(
        map(x =>  _setFullNameOnUserForeigns<TimesheetSummary>(x[0], x[1]))
    );

    selectedWeekTimesheets$: Observable<Maybe<Immutable<Timesheet>[]>> = combineLatest([
        this.weeklySummaries$,
        this.store.select$(['timesheetAdminSelectedWeekNr', 'missions'])
    ]).pipe(map(([summaries, {timesheetAdminSelectedWeekNr, missions}]) => {
        const summary = _find<TimesheetSummary>(summaries, timesheetAdminSelectedWeekNr, "weekNr");
        if(!summary?.timesheets?.length) return;
        return modelCtx.get("timesheets")
            .include("mission")
            .select({missions, timesheets: summary.timesheets}, 
                x => { return <Timesheet> {...x, fullName: summary.fullName}})
    }))
    
    constructor(
        private store: Store<StoreState>, 
        private modelFormService: ModelFormService<ModelState>){
        this.store.dispatch({type: FetchModelsAction, props: ["users"]})
    }
    
    openTimesheetForm = (entityId?: Maybe<string>, initialValue?: Immutable<Partial<TimesheetForm>>): void => {
        this.modelFormService.open(
            entityId ? EditTimesheetModelForm : CreateTimesheetModelForm,
            initialValue || {id: <string> entityId}
        )
    };

    updateCriteria = (weekCriteria: Immutable<Partial<WeekCriteria>>): void =>       
        this.store.dispatch(<SetTimesheetCriteriaWithWeekCriteriaAction>{ 
            type: SetTimesheetCriteriaWithWeekCriteriaAction, weekCriteria 
        })

    updateWeekNr = (weekNr: number | string): void => {  
        weekNr = (typeof weekNr === "number") ? weekNr : parseInt(weekNr);
        this.store.dispatch(<SetSelectedWeekAction>{ type: SetSelectedWeekAction, weekNr })
    }
    
    updateStatuses(ids: string[], status: TimesheetStatus): void{
        if(ids.length == 0) return;
        this.store.dispatch(<UpdateTimesheetStatusesAction>{ type: UpdateTimesheetStatusesAction, ids, status });      
    }

    updateLeaderSettings(settings: LeaderSettings): void {
        if(settings == null) return;
        this.store.dispatch(<UpdateLeaderSettingsAction>{ type: UpdateLeaderSettingsAction, settings })
    }
}