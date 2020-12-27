import { StateRequestQueue } from '@http/interfaces';
import { _createReducer } from '@state/helpers/create-reducer.helper';
import { Immutable } from '@global/interfaces';
import { HttpErrorAction } from './http-error.action';

export const HttpErrorReducer = _createReducer(
    HttpErrorAction,
    (state: Immutable<StateRequestQueue>) => {
        if(!state.requestQueue) return;
        const currentRequest = state.requestQueue[0];
        return { ...currentRequest.stateSnapshot, requestQueue: [] };
    }
)