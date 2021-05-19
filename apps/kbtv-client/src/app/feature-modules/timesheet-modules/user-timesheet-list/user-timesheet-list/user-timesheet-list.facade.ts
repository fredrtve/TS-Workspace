import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timesheet, UserTimesheet } from '@core/models';
import { StateMissions, StateUserTimesheets } from '@core/state/global-state.interfaces';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { TimesheetFilter } from '@shared-timesheet/timesheet-filter/timesheet-filter.model';
import { filterRecords } from '@shared/operators/filter-records.operator';
import { Immutable, Maybe } from 'global-types';
import { RelationInclude, _getModels } from 'model/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentStore, Store } from 'state-management';
import { StateSyncConfig } from 'state-sync';
import { SetUserTimesheetCriteriaAction } from './state/set-user-timesheet-criteria.reducer';
import { UserTimesheetListState } from './state/user-timesheet-list.state';
import { UserTimesheetListCriteriaQueryParam } from './user-timesheet-list-route-params.const';

type State = StateMissions & StateUserTimesheets & StateSyncConfig;

@Injectable()
export class UserTimesheetListFacade {
    
      get criteria(){ return this.componentStore.state.timesheetCriteria; } 
      criteria$ = this.componentStore.selectProperty$("timesheetCriteria");
  
      private filteredTimesheets$ = combineLatest([
          this.store.selectProperty$("userTimesheets"),
          this.criteria$
      ]).pipe(filterRecords(TimesheetFilter), map(x => x.records));

      timesheets$: Observable<Maybe<Immutable<Timesheet>[]>> = combineLatest([
        this.filteredTimesheets$, 
        this.store.selectProperty$("missions")
      ]).pipe(
          map(([userTimesheets, missions]) =>  {
            if(!userTimesheets) return;
            const cfg: RelationInclude<State, UserTimesheet> = {prop: "userTimesheets", foreigns: ["mission"]};     
            return _getModels<State, UserTimesheet>({userTimesheets, missions: missions || []}, cfg);
          })
      );

      constructor(
          private store: Store<State>,
          private componentStore: ComponentStore<UserTimesheetListState>,  
          private route: ActivatedRoute,
      ) { 
        this.setInitialCriteria(); 
      }
      
      updateCriteria = (timesheetCriteria: Immutable<Partial<TimesheetCriteria>>) => 
          this.componentStore.dispatch<SetUserTimesheetCriteriaAction>({ 
            type: SetUserTimesheetCriteriaAction, timesheetCriteria, 
            lowerBound: this.store.state.syncConfig.initialTimestamp
          });

      private setInitialCriteria(){
        let rawCriteria = this.route.snapshot.params[UserTimesheetListCriteriaQueryParam];

        const criteria: TimesheetCriteria = rawCriteria ? JSON.parse(rawCriteria) : {};
          
        if(criteria.dateRange && !criteria.dateRangePreset) 
          criteria.dateRangePreset = DateRangePresets.Custom
      
        this.updateCriteria(criteria);
      }
 
    
}