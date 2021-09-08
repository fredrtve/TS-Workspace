import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { exhaustMap, finalize, map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { RefreshTokenResponse, Tokens } from '../interfaces';
import { AuthHttpFactoryService } from '../services/auth-http-factory.service';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './actions.const';

@Injectable()
export class RefreshTokenHttpEffect implements Effect {

    constructor(
        private httpFactory: AuthHttpFactoryService,
        private authService: AuthService
    ){ }

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([AuthActions.refreshToken]),
            exhaustMap(x => this.refreshToken$(x.action.tokens)),
            map(response => {
                if(!response?.accessToken?.token) return AuthActions.logout({});
                else return AuthActions.refreshTokenSuccess({ response })
            })                
        )
    }

    onErrorAction = (err: HttpErrorResponse) => AuthActions.logout({});

    private refreshToken$(tokens: Tokens): Observable<RefreshTokenResponse> {
        if(!tokens.refreshToken) throwError('Refresh token missing')
        
        this.authService.isRefreshingToken = true;

        return this.httpFactory.getObserver$<RefreshTokenResponse>("refreshToken", tokens).pipe(
            finalize(() => this.authService.isRefreshingToken = false)
        );
    }
    
}