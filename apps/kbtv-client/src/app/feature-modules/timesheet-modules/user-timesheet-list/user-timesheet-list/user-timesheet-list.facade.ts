import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { modelCtx } from '@core/configurations/model/app-model-context';
import { Timesheet } from '@core/models';
import { StateActivities, StateMissionActivities, StateMissions, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '@shared-timesheet/timesheet-filter/timesheet-filter.model';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { Immutable, Maybe } from '@fretve/global-types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentStore, Store } from 'state-management';
import { StateSyncConfig } from 'state-sync';
import { UserTimesheetListLocalActions } from './state/local-state';
import { UserTimesheetListState } from './state/user-timesheet-list.state';
import { UserTimesheetListCriteriaQueryParam } from './user-timesheet-list-route-params.const';

type State = StateMissions & StateUserTimesheets & StateSyncConfig & StateMissionActivities & StateActivities;

const timesheetQuery = modelCtx.get("userTimesheets").include("missionActivity", x => x.include("mission").include("activity"))

@Injectable()
export class UserTimesheetListFacade {
    
      get criteria(){ return this.componentStore.state.timesheetCriteria; } 
      criteria$ = this.componentStore.selectProperty$("timesheetCriteria");

      private mappedTimesheets$: Observable<Maybe<Immutable<Timesheet>[]>> = 
        this.store.select$(["userTimesheets", "missions", "missionActivities", "activities"]).pipe(
          map(state => timesheetQuery.run(state))
        );

      timesheets$ = combineLatest([this.mappedTimesheets$,this.criteria$]).pipe(
        filterRecords(TimesheetFilter), 
        map(x => x.records)
      );

      constructor(
          private store: Store<State>,
          private componentStore: ComponentStore<UserTimesheetListState>,  
          private route: ActivatedRoute,
      ) { 
        this.setInitialCriteria(); 
      }
      
      updateCriteria = (timesheetCriteria: Immutable<Partial<TimesheetCriteria>>) => 
          this.componentStore.dispatch(UserTimesheetListLocalActions.setTimesheetCriteria({ 
            timesheetCriteria, 
            lowerBound: this.store.state.syncConfig.initialTimestamp
          }));

      private setInitialCriteria(){
        let rawCriteria = this.route.snapshot.params[UserTimesheetListCriteriaQueryParam];

        const criteria: TimesheetCriteria = rawCriteria ? JSON.parse(rawCriteria) : {};
          
        if(criteria.dateRange && !criteria.dateRangePreset) 
          criteria.dateRangePreset = DateRangePresets.Custom
      
        this.updateCriteria(criteria);
      }
 
    
}