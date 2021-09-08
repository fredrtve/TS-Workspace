import { Injectable } from '@angular/core';
import { GlobalActions } from '@core/global-actions';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthActions } from 'state-auth';
import { DispatchedActions, Effect, listenTo, StateAction, Store } from 'state-management';
import { SyncActions } from 'state-sync';

@Injectable()
export class SyncUserOnLoginEffect implements Effect {

    constructor(private store: Store<unknown>){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([AuthActions.loginSuccess]),
            mergeMap(({action}) => {
                const actions: StateAction[] = [SyncActions.sync()];

                if(action.previousUser?.userName !== action.response.user.userName) //Wipe before sync if new login
                    actions.unshift(GlobalActions.wipeState({ defaultState: this.store.defaultState }));

                return of(...actions)
            }),
        ) 
    }
}