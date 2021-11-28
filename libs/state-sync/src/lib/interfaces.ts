import { Type } from '@angular/core';
import { Maybe, UnknownState } from '@fretve/global-types';
import { Observable } from 'rxjs';

export interface StateSyncConfig { syncConfig: SyncConfig }

export interface StateSyncTimestamp { 
    /** Last synchronization as UNIX milliseconds timestamp. */
    syncTimestamp: number; 
}

/** Configuration for synchronized state management.
 *  Provided by consumer application with token {@link SYNC_STATE_CONFIG}
 */
export type SyncStateConfig<TState> = {[key in keyof TState]: SyncStatePropConfig}

/** Configuration for synchronized state property */
export interface SyncStatePropConfig {
    /** Type of state data */
    type?: "value" | "array",
    /** Set to false if you wish to preserve values after wipes */
    wipeable?: boolean,
    /** A property on state value that unqiuely identifies it. */
    idProp: string
}

/** User configuration for synchronization */
export interface SyncConfig{
    /** The interval in which the system synchronizes in seconds */
    refreshTime: number; 

    /** A timestamp limiting the amount of data fetched from external api. 
     *  Only data created or updated after the timestamp should be included. 
     * @remarks Setting this value will cause the system to wipe old state and resynchronize
    */
    initialTimestamp: number;
}

/** Response from a synchronization request */
export interface SyncResponse<TState>{
    /** UNIX milliseconds timestamp when synchronization happen.*/
    timestamp: number;
    arrays: SyncArraysResponse<TState>;
    values: SyncValuesResponse<TState>;
}

/** Response data for state arrays
 * @remarks Keys should correspond to prop configs with type 'array' in {@link SyncStatePropConfig} 
*/
export type SyncArraysResponse<TState> = {[key in keyof TState]: SyncArrayResponse}

/** Response data for single state values
 * @remarks Keys should correspond to prop configs with type 'value' in {@link SyncStatePropConfig} 
*/
export type SyncValuesResponse<TState> = {[key in keyof TState]: unknown}

/** Response data for a state array */
export interface SyncArrayResponse{
    /** New or updated entities */
    entities: UnknownState[];
    /** The id's of deleted entities */
    deletedEntities: (number | string)[];
}

/** Responsible for fetching data from external API. 
 *  Provided by consumer application with token {@link SYNC_HTTP_FETCHER}. */
export interface SyncHttpFetcher<TState> {
    /** 
     * Fetches data from external api and returns a data observer with correct format. 
     * @param timestamp - UNIX milliseconds timestamp since last sync 
     */
    fetch$(config: Maybe<SyncConfig>, timestamp: Maybe<number>): Observable<SyncResponse<TState>>
}

export interface CustomSyncProviders { fetcher: Type<SyncHttpFetcher<unknown>>, config: SyncStateConfig<unknown> }