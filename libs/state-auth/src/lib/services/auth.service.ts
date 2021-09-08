import { Inject, Injectable } from '@angular/core';
import { _getUnixTimeSeconds } from 'date-time-helpers';
import { Immutable, Maybe } from 'global-types';
import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { select, Store } from 'state-management';
import { AUTH_COMMAND_API_MAP } from '../injection-tokens.const';
import { AuthCommandApiMap, Credentials, CurrentUser, StoreState } from '../interfaces';
import { AuthActions } from '../state/actions.const';

/** The class responsible for exposing authorization state & commands */
@Injectable({providedIn: 'root'})
export class AuthService {
  /** Is set to true if there is an active refresh request */
  isRefreshingToken: boolean = false;

  /** An observable of the authorization status of current user */
  isAuthorized$: Observable<boolean> = this.store.state$.pipe(
    select(["accessToken", "refreshToken"]),
    map(state => state != null && state.refreshToken != null && state.accessToken != null)
  )

  /** An observable of the current user */
  currentUser$: Observable<CurrentUser> = this.store.selectProperty$("currentUser");

  /** An observable that emits access tokens when they are received. */
  newAccessToken$: Observable<string> = 
    this.store.selectProperty$("accessToken").pipe(skip(1));

  get hasAccessTokenExpired(): boolean{
    const expires = this.store.state.accessTokenExpiration

    if(!expires) return true; //If no access token expiration set
    if (_getUnixTimeSeconds() >= expires) return true; //If access token expired
    return false;
  }

  get isAuthorized(): boolean {
    return this.getAccessToken() != null && (this.commandApiMap.refreshToken != null || !this.hasAccessTokenExpired);
  }

  constructor (
    private store: Store<StoreState>,
    @Inject(AUTH_COMMAND_API_MAP) private commandApiMap: AuthCommandApiMap,
  ) {}

  getAccessToken = (): Maybe<string> => this.store.state.accessToken 

  getCurrentUser = (): Maybe<Immutable<CurrentUser>> => 
    this.store.state.currentUser 
  
  /** Attempts to authorize user with external api. 
   * @param credentials - The authorization data
   * @param returnUrl - A router url used to navigate the user if login succeeds. 
   */
  login = (credentials: Credentials, returnUrl?: string): void => 
    this.store.dispatch(AuthActions.login({ credentials, returnUrl }));
  
  /** Removes the authorization state and redirects the user to login page. */
  logout = (returnUrl?: string): void =>
    this.store.dispatch(AuthActions.logout({ refreshToken: this.getRefreshToken()!, returnUrl }))
  
  /** Attempts to request a new access token from the external api */
  refreshToken = (): void => {
    if(this.isRefreshingToken || !navigator.onLine) return;
    this.store.dispatch(AuthActions.refreshToken({
      tokens: { accessToken: this.getAccessToken()!, refreshToken: this.getRefreshToken()! }
    }))
  }
  
  private getRefreshToken = (): Maybe<string> => 
    this.store.state.refreshToken 
}

