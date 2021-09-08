import { UnknownModelState } from 'model/core';
import { _createReducers, _on } from 'state-management';
import { StateFetchingStatus } from '../interfaces';
import { ModelFetcherActions } from './actions';

export const ModelFetcherReducers = _createReducers<StateFetchingStatus<UnknownModelState>>(
    _on(ModelFetcherActions.fetchSucceeded, (state, {payload, stateProp}) => ({
        [stateProp]: payload,
        fetchingStatus:  {...state.fetchingStatus || {}, [stateProp]: "success"}
    })),
    _on(ModelFetcherActions.fetchFailed, (state, {stateProp}) => ({
        fetchingStatus: {...state.fetchingStatus || {}, [stateProp]: "failed" }
    })),
    _on(ModelFetcherActions.isFetching, (state, action) => ({
        fetchingStatus: {...state.fetchingStatus || {}, ...action.fetchingStatus}
    }))
)
