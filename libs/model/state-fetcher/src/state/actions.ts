import { Immutable, Prop } from "global-types";
import { UnknownModelState } from "model/core";
import { _createAction, _payload } from "state-management";
import { FetchingStatusMap } from "../interfaces";

export const ModelFetcherActions = {
    fetch: <TState>(payload: Immutable<{ props: Prop<Immutable<TState>>[] }>) => 
        ({...payload, type: "Fetch Models"}), 
    isFetching: <TState extends UnknownModelState>(payload: Immutable<{ fetchingStatus: Immutable<FetchingStatusMap<TState>> }>) => 
        ({...payload, type: "Is Fetching"}), 
    fetchSucceeded: _createAction("Fetch Succeeded", _payload<{ stateProp: string; payload: unknown[]; }>()),
    fetchFailed: _createAction("Fetch Failed", _payload<{ stateProp: string; }>()),
}