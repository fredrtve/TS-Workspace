import { Inject, Injectable } from '@angular/core';
import { awaitOnline } from '@fretve/global-utils';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo, Store } from 'state-management';
import { SYNC_HTTP_FETCHER, SYNC_STATE_CONFIG } from '../injection-tokens.const';
import { SyncHttpFetcher, SyncStateConfig } from '../interfaces';
import { StoreState } from "../store-state.interface";
import { SyncActions } from './actions';

@Injectable()
export class SyncStateHttpEffect implements Effect {

    private get syncConfig() { return this.store.state.syncConfig }

    private get syncTimestamp() { return this.store.state.syncTimestamp }

    constructor(
      @Inject(SYNC_HTTP_FETCHER) private httpFetcher: SyncHttpFetcher<unknown>,
      @Inject(SYNC_STATE_CONFIG) private syncStateConfig: SyncStateConfig<unknown>,
      private store: Store<StoreState>,
    ) {}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([SyncActions.sync, SyncActions.wipeState]),
            switchMap(x => awaitOnline()),
            exhaustMap(x => this.httpFetcher.fetch$(this.syncConfig, this.syncTimestamp)),
            map(response => SyncActions.syncSuccess({ response, syncStateConfig: this.syncStateConfig }))
        )
    }

    onErrorAction = () => SyncActions.syncFailed();
}
