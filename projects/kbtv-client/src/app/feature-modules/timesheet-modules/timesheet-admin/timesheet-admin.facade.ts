import { Injectable } from '@angular/core';
import { Timesheet, User } from '@core/models';
import { _setFullNameOnUserForeigns } from '@shared-app/helpers/add-full-name-to-user-foreign.helper';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { _noEmployersFilter } from '@shared-timesheet/no-employers-filter.helper';
import { FetchTimesheetsAction } from '@shared-timesheet/state/fetch-timesheets.http.effect';
import { WeekCriteriaFormState } from '@shared/constants/forms/week-criteria-controls.const';
import { GroupByPeriod, TimesheetStatus } from '@shared/enums';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { _find } from 'array-helpers';
import { Immutable, Maybe } from 'global-types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentStore, Store } from 'state-management';
import { FetchModelsAction } from 'state-model';
import { TimesheetSummary } from '../shared-timesheet/interfaces';
import { WeekCriteria } from '../shared-timesheet/interfaces/week-criteria.interface';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../shared-timesheet/timesheet-filter/timesheet-filter.model';
import { SetSelectedWeekAction, SetTimesheetCriteriaAction } from './component-state-reducers';
import { ComponentStoreState, StoreState } from './store-state';
import { UpdateTimesheetStatusesAction } from './update-timesheet-statuses/update-timesheet-statuses.action';

@Injectable()
export class TimesheetAdminFacade {

    users$ = this.store.selectProperty$<User[]>("users").pipe(map(_noEmployersFilter));

    get selectedWeekNr(){ return this.componentStore.state.selectedWeekNr; } 
    selectedWeekNr$ = this.componentStore.selectProperty$<number>("selectedWeekNr");

    get weekCriteria(){ return this.componentStore.state.weekCriteria; } 
    weekCriteria$ = this.componentStore.selectProperty$<WeekCriteria>("weekCriteria");

    timesheetCriteria$ = this.componentStore.selectProperty$<TimesheetCriteria>("timesheetCriteria")

    weekCriteriaFormState$: Observable<WeekCriteriaFormState> = 
        this.users$.pipe(map(x => { return { options: {users: x} } }))

    private _weeklySummaries$ = combineLatest([
        this.store.selectProperty$<Timesheet[]>("timesheets"),
        this.componentStore.selectProperty$<TimesheetCriteria>("timesheetCriteria")
    ]).pipe(
        filterRecords(TimesheetFilter), 
        map(x => _getSummariesByType(GroupByPeriod.Week, x.records))
    );

    weeklySummaries$ = combineLatest([this._weeklySummaries$, this.users$]).pipe(
        map(x =>  _setFullNameOnUserForeigns<TimesheetSummary>(x[0], x[1]))
    );

    selectedWeekTimesheets$: Observable<Maybe<Immutable<Timesheet>[]>> = combineLatest([
        this.weeklySummaries$,
        this.selectedWeekNr$
    ]).pipe(map(([summaries, weekNr]) => {
        const summary = _find<TimesheetSummary>(summaries, weekNr, "weekNr");
        return summary?.timesheets.map(x => { return <Timesheet> {...x, fullName: summary.fullName}});
    }))
    
    constructor(
        private store: Store<StoreState>,
        private componentStore: ComponentStore<ComponentStoreState>
    ){
        this.store.dispatch({type: FetchModelsAction, props: ["users"]})
          
        this.componentStore.selectProperty$("timesheetCriteria").subscribe(timesheetCriteria => 
            this.store.dispatch(<FetchTimesheetsAction>{ type: FetchTimesheetsAction, timesheetCriteria }))
    }
    
    updateCriteria = (weekCriteria: WeekCriteria): void =>       
        this.componentStore.dispatch(<SetTimesheetCriteriaAction>{ type: SetTimesheetCriteriaAction, weekCriteria })

    updateWeekNr = (weekNr: number | string): void => {  
        weekNr = (typeof weekNr === "number") ? weekNr : parseInt(weekNr);
        this.componentStore.dispatch(<SetSelectedWeekAction>{ type: SetSelectedWeekAction, weekNr })
    }
    
    updateStatuses(ids: string[], status: TimesheetStatus): void{
        if(ids.length == 0) return;
        this.store.dispatch(<UpdateTimesheetStatusesAction>{ type: UpdateTimesheetStatusesAction, ids, status });      
    }
}