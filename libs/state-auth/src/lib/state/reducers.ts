import { _getUnixTimeSeconds } from "date-time-helpers";
import { _createReducers, _on } from "state-management";
import { StoreState } from "../interfaces";
import { AuthActions } from "./actions.const";

export const AuthReducers = _createReducers<StoreState>(
    _on(AuthActions.wipeTokens, () => <any>{accessToken: undefined, accessTokenExpiration: undefined, refreshToken: undefined}),
    _on(AuthActions.refreshToken, () => <any>{refreshToken: undefined }),
    _on(AuthActions.refreshTokenSuccess, (state, {response: {accessToken, refreshToken}}) => ({
        accessToken: accessToken.token,
        accessTokenExpiration: _getUnixTimeSeconds() + accessToken.expiresIn,
        refreshToken: refreshToken
    })),
    _on(AuthActions.loginSuccess, (state, {response: {accessToken, refreshToken, user}}) => ({
        accessToken: accessToken?.token.replace("Bearer ", ""), 
        accessTokenExpiration: _getUnixTimeSeconds() + accessToken.expiresIn,
        refreshToken, 
        currentUser: user
    }))
)