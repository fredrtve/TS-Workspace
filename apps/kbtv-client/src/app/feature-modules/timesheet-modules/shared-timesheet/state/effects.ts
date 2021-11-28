import { Injectable } from '@angular/core';
import { ApiUrl } from '@core/api-url.enum';
import { Timesheet } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { _isCriteriaContainedInCache } from '@shared-app/helpers/is-criteria-contained-in-cache';
import { _timesheetCriteriaQueryParamsFactory } from '@shared-timesheet/timesheet-criteria-query-params.factory';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';
import { merge, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { TimesheetCriteria } from '../timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '../timesheet-filter/timesheet-filter.model';
import { SharedTimesheetActions } from './actions.const';
import { StateSharedTimesheet } from './state-shared-timesheet.interface';

@Injectable()
export class FetchTimesheetsHttpEffect implements Effect {

  constructor(private apiService: ApiService){ }

  handle$(actions$: DispatchedActions<StateSharedTimesheet>) {
    return actions$.pipe(
      listenTo([SharedTimesheetActions.fetchTimesheets]),
      filter(x => !this.isContained(x.action.timesheetCriteria, x.stateSnapshot.timesheetCriteriaCache)),
      switchMap(( { action: { timesheetCriteria } } ) => merge(
        of(SharedTimesheetActions.setCriteriaCache({criteria: timesheetCriteria})),
        this.fetchTimesheets$(timesheetCriteria),
      )), 
    )
  }

  onErrorAction = () => SharedTimesheetActions.fetchingFailed();


  private isContained(criteria: Maybe<Immutable<TimesheetCriteria>>, criteriaCache: Maybe<ImmutableArray<TimesheetCriteria>>): boolean {
    return _isCriteriaContainedInCache(criteria, criteriaCache, TimesheetFilter);
  }
    
  private fetchTimesheets$ = (criteria: Immutable<TimesheetCriteria>) =>
    this.apiService.get<Timesheet[]>(ApiUrl.Timesheet, _timesheetCriteriaQueryParamsFactory(criteria)).pipe(
        map(timesheets => SharedTimesheetActions.setFetchedTimesheets({ timesheets }))
    );

}

