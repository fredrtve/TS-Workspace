import { Injectable } from '@angular/core';
import { ApiUrl } from '@core/api-url.enum';
import { ApiService } from '@core/services/api.service';
import { _isCriteriaContainedInCache } from '@shared-app/helpers/is-criteria-contained-in-cache';
import { _timesheetCriteriaQueryParamsFactory } from '@shared-timesheet/timesheet-criteria-query-params.factory';
import { Immutable, ImmutableArray, Maybe } from 'global-types';
import { merge, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { DispatchedAction, Effect, listenTo, StateAction } from 'state-management';
import { TimesheetCriteria } from '../timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../timesheet-filter/timesheet-filter.model';
import { FetchingTimesheetsFailedAction, FetchTimesheetsAction, SetCriteriaCacheAction, SetFetchedTimesheetsAction } from './actions.const';
import { StateSharedTimesheet } from './state-shared-timesheet.interface';

@Injectable()
export class FetchTimesheetsHttpEffect implements Effect<FetchTimesheetsAction> {

  constructor(private apiService: ApiService){ }

  handle$(actions$: Observable<DispatchedAction<FetchTimesheetsAction, StateSharedTimesheet>>): Observable<StateAction> {
    return actions$.pipe(
      listenTo([FetchTimesheetsAction]),
      filter(x => !this.isContained(x.action.timesheetCriteria, x.stateSnapshot.timesheetCriteriaCache)),
      switchMap(( { action: { timesheetCriteria } } ) => merge(
        of(<SetCriteriaCacheAction>{type: SetCriteriaCacheAction, criteria: timesheetCriteria}),
        this.fetchTimesheets$(timesheetCriteria),
      )), 
    )
  }

  onErrorAction = () => <FetchingTimesheetsFailedAction> { type: FetchingTimesheetsFailedAction };


  private isContained(criteria: Maybe<Immutable<TimesheetCriteria>>, criteriaCache: Maybe<ImmutableArray<TimesheetCriteria>>): boolean {
    return _isCriteriaContainedInCache(criteria, criteriaCache, TimesheetFilter);
  }
    
  private fetchTimesheets$ = (criteria: Immutable<TimesheetCriteria>): Observable<SetFetchedTimesheetsAction> => {
    return this.apiService.get(ApiUrl.Timesheet, _timesheetCriteriaQueryParamsFactory(criteria)).pipe(
        map(timesheets => <SetFetchedTimesheetsAction>{ type: SetFetchedTimesheetsAction, timesheets })
    );
  };

}

