import { _createReducers, _on } from "state-management";
import { StateRequestLog, StateRequestQueue } from "../interfaces";
import { OptimisticActions } from "./actions";

export const OptimisticReducers = _createReducers<StateRequestQueue & StateRequestLog>(
    _on(OptimisticActions.dispatchNext, (state) => {
        if(!state.requestQueue) return;
        const requestQueue = [...state.requestQueue];
        const request = requestQueue[0];
        if(request) requestQueue[0] = {...request, dispatched: true};
        return {requestQueue}
    }),
    _on(OptimisticActions.httpError, (state) => 
        state.requestQueue ? { ...state.requestQueue[0].stateSnapshot, requestQueue: []} : null 
    ),
    _on(OptimisticActions.queuePush, (state, action) => ({
        requestQueue: [...(state.requestQueue || []), action.command]
    })),
    _on(OptimisticActions.appendLog, (state, action) => ({ 
        requestLog: state.requestLog  
            ? [...action.completedCommands, ...state.requestLog] 
            : action.completedCommands
    })),
    _on(OptimisticActions.queueShift, (state) => {
        if(!state.requestQueue) return;
        const requestQueue = [...state.requestQueue];
        requestQueue.shift();
        return {requestQueue};
    })
)
