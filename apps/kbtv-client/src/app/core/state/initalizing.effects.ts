import { Injectable } from '@angular/core';
import { HttpQueuer } from 'optimistic-http';
import { filter, first, map } from 'rxjs/operators';
import { DbActions } from 'state-db';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { ContinousSyncService, SyncActions } from 'state-sync';

@Injectable()
export class InitalizeSyncEffect implements Effect {

    constructor(private continousSyncService: ContinousSyncService) {}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([DbActions.setPersistedState]),
            filter(x => x.action.storageType === "idb-keyval"), 
            first(),
            map(x => this.continousSyncService.start()),
        ) 
    }
}

@Injectable()
export class InitalizeHttpQueueEffect implements Effect {

    constructor(private httpQueuer: HttpQueuer) {}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([SyncActions.syncSuccess]),
            first(),
            map(x => this.httpQueuer.initalize()),
        ) 
    }
}