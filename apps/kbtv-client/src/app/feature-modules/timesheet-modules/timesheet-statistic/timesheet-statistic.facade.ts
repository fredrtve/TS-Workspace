import { Injectable } from '@angular/core';
import { Timesheet } from '@core/models';
import { _setFullNameOnUserForeigns } from '@shared-app/helpers/add-full-name-to-user-foreign.helper';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { _noEmployersFilter } from '@shared-timesheet/no-employers-filter.helper';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { Immutable, ImmutableArray } from 'global-types';
import { FetchModelsAction } from 'model/state-fetcher';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from 'state-management';
import { TimesheetSummary } from '../shared-timesheet/interfaces';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../shared-timesheet/timesheet-filter/timesheet-filter.model';
import { StoreState } from './state/store-state';
import { SetGroupByAction } from './state/actions.const';
import { SetTimesheetCriteriaAction } from '@shared-timesheet/state/actions.const';

type ValidRecord = Timesheet | TimesheetSummary;

@Injectable({providedIn: "any"})
export class TimesheetStatisticFacade extends WithUnsubscribe() {

    criteria$ = this.store.selectProperty$("timesheetStatisticTimesheetCriteria");
    get criteria() { return this.store.state.timesheetStatisticTimesheetCriteria }

    groupBy$ = this.store.selectProperty$("timesheetStatisticGroupBy");

    isFetching$: Observable<boolean> = 
        this.store.selectProperty$('isFetching').pipe(
            map(x => x && x.timesheets), distinctUntilChanged())

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