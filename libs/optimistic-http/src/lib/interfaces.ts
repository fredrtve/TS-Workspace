import { Immutable, Maybe, UnknownState } from 'global-types';
import { StateAction } from 'state-management';

export interface QueuedCommand { 
    request: OptimisticHttpRequest, 
    stateSnapshot: Maybe<UnknownState>, 
    dispatched?: boolean,
};

/** Represents a completed command with a status indicating if the command succeeded. */
export interface CompletedCommand { 
    request: Immutable<OptimisticHttpRequest>, 
    succeeded: boolean;
};

/** Represents a slice of state containing the request queue */
export interface StateRequestQueue { 
    requestQueue: QueuedCommand[]; 
};

/** Represents a slice of state containing the request log of previus requests and their statuses*/
export interface StateRequestLog { 
    requestLog: CompletedCommand[]; 
};

export type OptimisticHttpHeaders = {[key: string]: string | string[]};

export type SupportedContentTypes = "json" | "formData";

/** Describes an object used to make optimistic http requests. */
export interface OptimisticHttpRequest<TContentType extends SupportedContentTypes = "json"> { 
    /** The url suffix of the api endpoint. 
     * Gets appended to base url provided with {@link OPTIMISTIC_BASE_API_URL} */
    apiUrl: string; 
    /** The http method of the request */
    method: "POST" | "PUT" | "DELETE"; 
    /** The body of the http request. 
     *  If contentType is set to 'formData', this body will represent key/value pairs and any nested objects are serialized.*/
    body?: {} | null;   
    /** The headers of the http request */
    headers?: OptimisticHttpHeaders;
    /** The type of content in body. Default is 'json'. */
    contentType?: TContentType;
    /** An optional string that identifies the type of request */
    type?: string;
};

/** A map of actions that should dispatch an optimistic http request. 
 *  Provided with token {@link ACTION_REQUEST_MAP} or with the forRoot & forFeature functions on {@link OptimisticHttpModule} */
 export declare type ActionRequestMap<TActions extends StateAction> = {
    [P in TActions as P['type']]: ActionRequestConverterFn<P>;
};

export type ActionRequestConverterFn<TAction> = (a: TAction) => OptimisticHttpRequest<SupportedContentTypes>

/** Represents a type that can be serialized. No functions are allowed. */
export type AsJson<T> = 
  T extends string | number | boolean | null ? T : 
  T extends Function ? never : 
  T extends object ? { [K in keyof T]: AsJson<T[K]> } : 
  never;

/** Represents a state action with type equivalent to generic TCommands provided */
export type ActionWithType<TCommands> = Omit<StateAction, 'type'> & {type: TCommands};