import { Immutable, UnknownState } from 'global-types';
import { UnknownModelState } from 'model/core';
import { Reducer, _createReducer } from 'state-management';
import { StateFetchingStatus } from '../interfaces';
import { IsFetchingModelsAction, ModelFetchingFailedAction, ModelFetchingSucceededAction } from './actions';

export const SetFetchedModelReducer: Reducer<StateFetchingStatus<UnknownModelState>, ModelFetchingSucceededAction> = _createReducer(
    ModelFetchingSucceededAction,
    (state: StateFetchingStatus<UnknownModelState>, action: Immutable<ModelFetchingSucceededAction>) => {
        const newState: Partial<UnknownState & StateFetchingStatus<UnknownModelState>> = {};
        newState[action.stateProp] = action.payload;
        newState.fetchingStatus = {...state.fetchingStatus || {}, [action.stateProp]: "success"};
        return newState;
    },
)

export const SetFetchingStatusFailedReducer: Reducer<StateFetchingStatus<UnknownModelState>, ModelFetchingFailedAction> = _createReducer(
    ModelFetchingFailedAction,
    (state: StateFetchingStatus<UnknownModelState>, action: Immutable<ModelFetchingFailedAction>) => {
        return { fetchingStatus: {...state.fetchingStatus || {}, [action.stateProp]: "failed" } };
    },
)

export const SetFetchingModelStatusReducer: Reducer<StateFetchingStatus<UnknownModelState>, IsFetchingModelsAction> = _createReducer(
    IsFetchingModelsAction,
    (state: StateFetchingStatus<UnknownModelState>, action) => {
        return { fetchingStatus: {...state.fetchingStatus || {}, ...action.fetchingStatus} };
    },
)