import { Injectable } from '@angular/core';
import { modelCtx } from '@core/configurations/model/app-model-context';
import { Timesheet } from '@core/models';
import { LeaderSettings } from '@core/models/leader-settings.interface';
import { ModelState } from '@core/state/model-state.interface';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { _setFullNameOnUserForeigns } from '@shared-app/helpers/add-full-name-to-user-foreign.helper';
import { TimesheetForm, TimesheetModelForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { WeekCriteriaFormState } from '@shared-timesheet/forms/week-criteria-controls.const';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { _noEmployersFilter } from '@shared-timesheet/no-employers-filter.helper';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { _find } from '@fretve/array-helpers';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';
import { ModelFormService } from 'model/form';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'state-management';
import { TimesheetSummary } from '../shared-timesheet/interfaces';
import { WeekCriteria } from '../shared-timesheet/interfaces/week-criteria.interface';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../shared-timesheet/timesheet-filter/timesheet-filter.model';
import { TimesheetAdminActions } from './state/actions.const';
import { StoreState } from './store-state';

const timesheetQuery = modelCtx.get("timesheets").include("missionActivity", x => x.include("mission").include("activity"))

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

    private mappedTimesheets$ = this.store.select$(['timesheets', 'missions', 'activities', 'missionActivities']).pipe(
        map(x => timesheetQuery.run(x))
    );

    private _weeklySummaries$ = combineLatest([
        this.mappedTimesheets$, 
        this.store.selectProperty$('timesheetAdminTimesheetCriteria')
    ]).pipe(
        filterRecords(TimesheetFilter), 
        map(x => _getSummariesByType(GroupByPeriod.Week, x.records))
    );

    weeklySummaries$ = combineLatest([this._weeklySummaries$, this.users$]).pipe(
        map(x =>  _setFullNameOnUserForeigns<TimesheetSummary>(x[0], x[1]))
    );

    selectedWeekTimesheets$: Observable<Maybe<Immutable<Timesheet>[]>> = combineLatest([
        this.weeklySummaries$,
        this.store.selectProperty$('timesheetAdminSelectedWeekNr')
    ]).pipe(map(([summaries, selectedWeekNr]) => {
        const summary = _find<TimesheetSummary>(summaries, selectedWeekNr, "weekNr");
        if(!summary?.timesheets?.length) return;
        return summary.timesheets.map(x => ({...x, fullName: summary.fullName!}))
    }))
    
    constructor(
        private store: Store<StoreState>, 
        private modelFormService: ModelFormService<ModelState>){
        this.store.dispatch(TimesheetAdminActions.fetchTimesheets<ModelState>({props: ["users"]}))
    }
    
    openTimesheetForm = (initialValue?: Immutable<Partial<Timesheet>>): void => {
        this.modelFormService.open(TimesheetModelForm, initialValue)
    };

    updateCriteria = (weekCriteria: Immutable<Partial<Omit<WeekCriteria, "weekNr" | "weekDay">>>): void =>       
        this.store.dispatch(TimesheetAdminActions.weekCriteriaChanged({ weekCriteria }))

    updateWeekNr = (weekNr: Maybe<number | string>): void =>  
        this.store.dispatch(TimesheetAdminActions.selectedWeekChanged({ weekNr }));
    
    updateStatuses(ids: string[], status: TimesheetStatus): void{
        if(ids.length == 0) return;
        this.store.dispatch(TimesheetAdminActions.updateTimesheetStatuses({ ids, status }));      
    }

    updateLeaderSettings(settings: LeaderSettings): void {
        if(settings == null) return;
        this.store.dispatch(TimesheetAdminActions.updateLeaderSettings({ settings }))
    }
}