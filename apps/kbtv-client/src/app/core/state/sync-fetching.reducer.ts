import { AppSyncStateConfig } from '../configurations/app-sync-state.config';
import { Immutable, Prop } from 'global-types';
import { _createReducer } from 'state-management';
import { StateSyncTimestamp, SyncStateAction, SyncStateSuccessAction, SyncStateFailedAction } from 'state-sync';
import { FetchingStatus, StateFetchingStatus } from 'model/state-fetcher';
import { ModelState } from './model-state.interface';

export const SetSyncModelsFetchingStatusReducer = _createReducer(
    SyncStateAction, 
    (state: Immutable<StateFetchingStatus<ModelState> & StateSyncTimestamp>) => 
        state.syncTimestamp ? null : setSyncFetching(state, "fetching")
)

export const SetSyncModelsSuccessStatusReducer = _createReducer(
    SyncStateSuccessAction, 
    (state: Immutable<StateFetchingStatus<ModelState>>) => 
        state.fetchingStatus?.missions !== "fetching" ? null : setSyncFetching(state, "success")
)

export const SetSyncModelsFailedStatusReducer = _createReducer(
    SyncStateFailedAction, 
    (state: Immutable<StateFetchingStatus<ModelState>>) => 
        state.fetchingStatus?.missions !== "fetching" ? null : setSyncFetching(state, "failed")
)

function setSyncFetching(state: StateFetchingStatus<ModelState>, val: FetchingStatus): StateFetchingStatus<ModelState>{
    const fetchingStatus = {...state.fetchingStatus};
    for(const prop in AppSyncStateConfig) fetchingStatus[<Prop<ModelState>> prop] = val;     
    return {fetchingStatus};
}
