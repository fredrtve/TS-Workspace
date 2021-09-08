import { AppSyncStateConfig } from "@core/configurations/app-sync-state.config";
import { GlobalActions } from "@core/global-actions";
import { Prop, UnknownState } from 'global-types';
import { FetchingStatus, StateFetchingStatus } from 'model/state-fetcher';
import { _createReducers, _on } from "state-management";
import { StateSyncTimestamp, SyncActions } from 'state-sync';
import { ModelState } from './model-state.interface';

export const CoreReducers = _createReducers<StateFetchingStatus<ModelState> & StateSyncTimestamp>(
    _on(SyncActions.sync, (state) => state.syncTimestamp ? null : setSyncFetching(state, "fetching")),
    _on(SyncActions.syncSuccess, (state) => state.fetchingStatus?.missions !== "fetching" ? null : setSyncFetching(state, "success")),
    _on(SyncActions.syncFailed, (state) => state.fetchingStatus?.missions !== "fetching" ? null : setSyncFetching(state, "failed")),
    _on(GlobalActions.wipeState, (state, action) => {
        const ignoredState: UnknownState = 
          {refreshToken: true, accessToken: true, accessTokenExpiration: true, currentUser: true};
        
        const deleteState: UnknownState = {};

        for(const key in state)
          if(!ignoredState[key]) deleteState[key] = undefined;

        return {...deleteState, ...(action.defaultState || {})}
    })

)

function setSyncFetching(state: StateFetchingStatus<ModelState>, val: FetchingStatus): StateFetchingStatus<ModelState>{
    const fetchingStatus = {...state.fetchingStatus};
    for(const prop in AppSyncStateConfig) fetchingStatus[<Prop<ModelState>> prop] = val;     
    return <StateFetchingStatus<ModelState>> {fetchingStatus};
}
