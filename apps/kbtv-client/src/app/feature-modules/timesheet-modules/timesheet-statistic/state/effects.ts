import { Injectable } from '@angular/core';
import { SharedTimesheetActions } from '@shared-timesheet/state/actions.const';
import { map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo, Store } from 'state-management';
import { StoreState } from './store-state';

@Injectable()
export class FetchTimesheetsEffect implements Effect {

    constructor(private store: Store<StoreState>){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([SharedTimesheetActions.setTimesheetCriteria]),
            map(x => SharedTimesheetActions.fetchTimesheets({
                timesheetCriteria: this.store.state.timesheetStatisticTimesheetCriteria 
            })),
        )
    }

}