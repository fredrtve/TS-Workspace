import { Injectable } from '@angular/core';
import { modelCtx } from '@core/configurations/model/app-model-context';
import { Timesheet } from '@core/models';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { _setFullNameOnUserForeigns } from '@shared-app/helpers/add-full-name-to-user-foreign.helper';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { _getSummariesByType } from '@shared-timesheet/helpers/get-summaries-by-type.helper';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';
import { FetchingStatus } from 'model/state-fetcher';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'state-management';
import { TimesheetSummary } from '../shared-timesheet/interfaces';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../shared-timesheet/timesheet-filter/timesheet-filter.model';
import { TimesheetStatisticActions } from './state/actions.const';
import { StoreState } from './state/store-state';

type ValidRecord = Timesheet | TimesheetSummary;

const timesheetQuery = modelCtx.get("timesheets").include("missionActivity");

@Injectable({providedIn: "any"})
export class TimesheetStatisticFacade extends WithUnsubscribe() {

    criteria$ = this.store.selectProperty$("timesheetStatisticTimesheetCriteria");
    get criteria() { return this.store.state.timesheetStatisticTimesheetCriteria }

    groupBy$ = this.store.selectProperty$("timesheetStatisticGroupBy");

    private mappedTimesheets = this.store.select$(['timesheets', 'missionActivities']).pipe(
        map(x => timesheetQuery.run(x))
    )

    private filteredTimesheets$ = combineLatest([
        this.mappedTimesheets, 
        this.store.selectProperty$("timesheetStatisticTimesheetCriteria")]
    ).pipe(
        filterRecords(TimesheetFilter), 
        map(x => x.records)
    );

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

    fetchingStatus$: Observable<Maybe<FetchingStatus>> = 
        this.store.selectProperty$("fetchingStatus").pipe(map(x => x?.timesheets))

    constructor(private store: Store<StoreState>){
        super();
        this.store.dispatch(TimesheetStatisticActions.fetchTimesheets<StoreState>({props: ["users"]}));
    }

    updateCriteria = (timesheetCriteria: Immutable<TimesheetCriteria>): void =>       
        this.store.dispatch(TimesheetStatisticActions.setTimesheetCriteria({ 
            timesheetCriteria, criteriaProp: "timesheetStatisticTimesheetCriteria" 
        }))
        
    updateGroupBy = (groupBy: GroupByPeriod): void =>       
        this.store.dispatch(TimesheetStatisticActions.setGroupBy({ groupBy }));

}