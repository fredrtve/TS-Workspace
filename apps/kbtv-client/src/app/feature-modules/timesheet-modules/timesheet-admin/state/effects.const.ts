import { Injectable } from '@angular/core';
import { ApiUrl } from '@core/api-url.enum';
import { ApiService } from '@core/services/api.service';
import { SharedTimesheetActions } from '@shared-timesheet/state/actions.const';
import { map, mergeMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo, Store } from 'state-management';
import { StoreState } from '../store-state';
import { TimesheetAdminActions } from './actions.const';

@Injectable()
export class UpdateLeaderSettingsHttpEffect implements Effect{

    constructor(private apiService: ApiService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([TimesheetAdminActions.updateLeaderSettings]),
            mergeMap(x => 
                this.apiService.put(ApiUrl.LeaderSettings, x.action.settings).pipe(map(() => 
                    TimesheetAdminActions.updateLeaderSettingsSuccess({ settings: x.action.settings })
                ))
            )
        )
    }

}

@Injectable()
export class FetchTimesheetsEffect implements Effect {

    constructor(private store: Store<StoreState>){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([TimesheetAdminActions.weekCriteriaChanged]),
            map(x => SharedTimesheetActions.fetchTimesheets({ 
                timesheetCriteria: this.store.state.timesheetAdminTimesheetCriteria 
            })),
        )
    }

}