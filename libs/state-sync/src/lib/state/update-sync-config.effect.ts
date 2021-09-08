import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { StoreState } from '../store-state.interface';
import { SyncActions } from './actions';

@Injectable()
export class UpdateSyncConfigEffect implements Effect {

    handle$(actions$: DispatchedActions<StoreState>) {
        return actions$.pipe(
            listenTo([SyncActions.updateConfig]),
            filter(x => 
                x.action.syncConfig.initialTimestamp !== 
                x.stateSnapshot?.syncConfig.initialTimestamp
            ),
            map(x => SyncActions.reloadState())
        )
    }

}
