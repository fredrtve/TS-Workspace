/** Route data associated with authorized routes */
export interface AuthRouteData { 
    /** The roles that are allowed access. */
    allowedRoles?: string[] 
}

/** Describes an object that can be used to handle external api commmands */
export interface AuthCommandApi<TBody, TResponse> { 
    /** The api url pointing to external api endpoint */
    apiUrl: string, 
    /** The http method used */
    method: string, 
    /** Used to format the body according to requirements of the external api */
    bodyFormatter?: (t: TBody) => unknown,
    /** Used to format the external api response according to the specified response type */
    responseFormatter?: (t: unknown) => TResponse
}

/** Represents a map of all external auth commands accociated with a {@link AuthCommandApi}. 
 *  Provided with token {@link AUTH_COMMAND_API_MAP}
 *  @remarks By leaving refreshToken entry empty, the feature will be disabled. 
 */
export interface AuthCommandApiMap {
    refreshToken?: AuthCommandApi<Tokens, RefreshTokenResponse>,
    login: AuthCommandApi<Credentials, LoginResponse>,
    logout: AuthCommandApi<{refreshToken: string}, void>
}

/** Represents an object of default router redirects.  
 *  Provided with token {@link AUTH_DEFAULT_REDIRECTS} */
export interface DefaultRedirects{
    /** The router url to the home screen.  */
    home: string, 
    /** The router url to the login screen.  */
    login: string
}

export interface StoreState extends
    StateCurrentUser {
        accessToken: string,
        accessTokenExpiration: number,
        refreshToken: string
}

/** Represents a state slice containing the current user logged in */
export interface StateCurrentUser { currentUser: CurrentUser }

/** Describes the user that is currently active.  */
export interface CurrentUser { userName: string, role: string }

/** Describes the expected result from a login command */
export interface LoginResponse {
    accessToken: AccessToken;
    /** A token used to request a new access token */
    refreshToken?: string;
    /** User details about the authorized user */
    user: CurrentUser;
}

/** Describes the expected result from a refresh token command */
export interface RefreshTokenResponse {
    /** A new access token */
    accessToken: AccessToken;
    /** A new refresh token */
    refreshToken: string;
}

/** Describes an object containing data used to authorize a user */
export interface Credentials{
    userName: string;
    password: string;
}

/** Describes an object  */
export interface Tokens{
    accessToken: string;
    refreshToken: string;
}

/** Represents a token received by an external api that authorizes the user for a certain time period 
 *  @remarks The token will be appended to the authorization header of every request */
export interface AccessToken { 
    /** The token value */
    token: string,
    /** The number of seconds before the token expires  */
    expiresIn: number
}
