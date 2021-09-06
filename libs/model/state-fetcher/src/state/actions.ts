import { Immutable, Prop } from "global-types";
import { UnknownModelState } from "model/core";
import { StateAction } from "state-management";
import { FetchingStatusMap } from "../interfaces"
;
export const FetchModelsAction = "FETCH_MODELS_ACTION";
export interface FetchModelsAction<TState> extends StateAction<typeof FetchModelsAction> { props: Prop<Immutable<TState>>[]; }

export const ModelFetchingSucceededAction = "MODEL_FETCHING_SUCCEEDED_ACTION";
export interface ModelFetchingSucceededAction extends StateAction<typeof ModelFetchingSucceededAction> {
    stateProp: string;
    payload: unknown[];
}

export const ModelFetchingFailedAction = "MODEL_FETCHING_FAILED_ACTION";
export interface ModelFetchingFailedAction extends StateAction<typeof ModelFetchingFailedAction> {
    stateProp: string;
}

export const IsFetchingModelsAction = "IS_FETCHING_MODELS_ACTION";
export interface IsFetchingModelsAction<TState = UnknownModelState> extends StateAction<typeof IsFetchingModelsAction> {
    fetchingStatus: FetchingStatusMap<TState>
}
