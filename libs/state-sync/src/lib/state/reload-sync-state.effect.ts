import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { SYNC_STATE_CONFIG } from '../injection-tokens.const';
import { SyncStateConfig } from '../interfaces';
import { SyncActions } from './actions';

@Injectable()
export class ReloadSyncStateEffect implements Effect {

    constructor(
      @Inject(SYNC_STATE_CONFIG) private syncStateConfig: SyncStateConfig<unknown>,
    ) { }

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([SyncActions.reloadState]), 
            mergeMap(x => of(
                SyncActions.wipeState({ syncStateConfig: this.syncStateConfig }),
                SyncActions.sync()
            )), 
        )
    }

}