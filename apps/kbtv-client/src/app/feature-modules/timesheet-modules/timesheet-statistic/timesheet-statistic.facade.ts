import { Injectable } from '@angular/core';
import { Timesheet } from '@core/models';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { _setFullNameOnUserForeigns } from '@shared-app/helpers/add-full-name-to-user-foreign.helper';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { SetTimesheetCriteriaAction } from '@shared-timesheet/state/actions.const';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { Immutable, ImmutableArray } from 'global-types';
import { FetchingStatus, FetchModelsAction } from 'model/state-fetcher';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'state-management';
import { TimesheetSummary } from '../shared-timesheet/interfaces';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../shared-timesheet/timesheet-filter/timesheet-filter.model';
import { SetGroupByAction } from './state/actions.const';
import { StoreState } from './state/store-state';

type ValidRecord = Timesheet | TimesheetSummary;

@Injectable({providedIn: "any"})
export class TimesheetStatisticFacade extends WithUnsubscribe() {

    criteria$ = this.store.selectProperty$("timesheetStatisticTimesheetCriteria");
    get criteria() { return this.store.state.timesheetStatisticTimesheetCriteria }

    groupBy$ = this.store.selectProperty$("timesheetStatisticGroupBy");

    private filteredTimesheets$ = this.store.select$(['timesheets', 'timesheetStatisticTimesheetCriteria']).pipe(
        map(x => <[ImmutableArray<Timesheet>, Immutable<TimesheetCriteria>]> [x.timesheets, x.timesheetStatisticTimesheetCriteria]),
        filterRecords(TimesheetFilter), 
        map(x => x.records));

    private groupedTimesheets$ = combineLatest([
        this.filteredTimesheets$,
        this.groupBy$
    ]).pipe(map(([timesheets, groupBy]) => {
        return _getSummariesByType(groupBy, timesheets) || timesheets;    
    }));

    tableConfig$: Observable<AgGridConfig<ValidRecord>> = combineLatest([
        this.groupedTimesheets$, 
        this.store.selectProperty$("users")
    ]).pipe(
        map(x =>  { return { data: _setFullNameOnUserForeigns<ValidRecord>(x[0], x[1]) }}
    ));

    fetchingStatus$: Observable<FetchingStatus> = 
        this.store.selectProperty$("fetchingStatus").pipe(map(x => x.timesheets))

    constructor(private store: Store<StoreState>){
        super();
        this.store.dispatch({type: FetchModelsAction, props: ["users"]})
    }

    updateCriteria = (timesheetCriteria: Immutable<TimesheetCriteria>): void =>       
        this.store.dispatch(<SetTimesheetCriteriaAction<StoreState>>{ type: SetTimesheetCriteriaAction, 
            timesheetCriteria, criteriaProp: "timesheetStatisticTimesheetCriteria" })

    updateGroupBy = (groupBy: GroupByPeriod): void =>       
        this.store.dispatch(<SetGroupByAction>{ type: SetGroupByAction, groupBy })

}