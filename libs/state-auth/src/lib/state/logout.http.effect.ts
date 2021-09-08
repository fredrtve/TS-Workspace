import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { AUTH_DEFAULT_REDIRECTS } from '../injection-tokens.const';
import { DefaultRedirects } from '../interfaces';
import { AuthHttpFactoryService } from '../services/auth-http-factory.service';
import { AuthActions } from './actions.const';

@Injectable()
export class LogoutHttpEffect implements Effect {

    constructor(
        @Inject(AUTH_DEFAULT_REDIRECTS) private redirects: DefaultRedirects,
        private httpFactory: AuthHttpFactoryService,
        private router: Router,
    ){ }

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([AuthActions.logout]),
            tap(x =>  this.router.navigate([this.redirects.login], { queryParams: {returnUrl: x.action.returnUrl}})),
            map(({action}) => { 
                if(action.refreshToken) 
                    this.httpFactory.getObserver$("logout", {refreshToken: action.refreshToken}).subscribe()

                return AuthActions.wipeTokens();
            })
        )
    }
}