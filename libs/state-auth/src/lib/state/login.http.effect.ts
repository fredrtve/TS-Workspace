import { Injectable } from '@angular/core';
import { exhaustMap, map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { LoginResponse, StateCurrentUser } from '../interfaces';
import { AuthHttpFactoryService } from '../services/auth-http-factory.service';
import { AuthActions } from './actions.const';

@Injectable()
export class LoginHttpEffect implements Effect {

    constructor(private httpFactory: AuthHttpFactoryService){}

    handle$(actions$: DispatchedActions<StateCurrentUser>) {
        return actions$.pipe(
            listenTo([AuthActions.login]),
            exhaustMap(({action, stateSnapshot}) => 
                this.httpFactory.getObserver$<LoginResponse>("login", action.credentials).pipe(
                    map(response => AuthActions.loginSuccess({
                        response, 
                        previousUser: stateSnapshot?.currentUser,
                        returnUrl: action.returnUrl
                    }))
                ),
            )
        )
        
    }

}