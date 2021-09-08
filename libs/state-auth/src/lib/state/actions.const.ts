import { _createAction, _payload } from 'state-management';
import { Credentials, CurrentUser, LoginResponse, RefreshTokenResponse, Tokens } from '../interfaces';

export const AuthActions = {
    logout: _createAction("Logout", _payload<LogoutActionPayload>()),
    login: _createAction("Login", _payload<LoginActionPayload>()),
    loginSuccess: _createAction("Login Success", _payload<LoginSuccessActionPayload>()),
    refreshTokenSuccess: _createAction("Refresh Token Success", _payload<RefreshTokenSuccessActionPayload>()),
    refreshToken: _createAction("Refresh Token", _payload<RefreshTokenActionPayload>()), 
    wipeTokens: _createAction("Wipe tokens"),   
    unauthorized: _createAction("Unauthorized")
}

/** Represents an action payload used to logout the current user */
export interface LogoutActionPayload {
    /** The refresh token so external api can clean up old tokens */
    refreshToken?: string, 
    /** A return url used if the user logs in again */
    returnUrl?: string
}

/** Represents the action payload when a successful login attempt has been made */
export interface LoginSuccessActionPayload {
    /** The response from the external api */
    response: LoginResponse,
    /** The previous user that was active in the system */
    previousUser?: CurrentUser,
    /** A router url used to redirect the user after login */
    returnUrl?: string  
}

/** Represents the action payload used to login a user */
export interface LoginActionPayload {
    credentials: Credentials,
    /** A router url used to redirect the user after login */
    returnUrl?: string  
}

export interface RefreshTokenSuccessActionPayload { response: RefreshTokenResponse }

export interface RefreshTokenActionPayload { tokens: Tokens }