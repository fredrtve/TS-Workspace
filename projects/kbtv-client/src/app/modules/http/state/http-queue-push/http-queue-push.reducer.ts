import { _createReducer } from 'state-management'
import { Immutable } from 'global-types';
import { StateRequestQueue } from '../../interfaces';
import { HttpQueuePushAction } from './http-queue-push.action';

export const HttpQueuePushReducer = _createReducer(
    HttpQueuePushAction,
    (state: Immutable<StateRequestQueue>, action: Immutable<HttpQueuePushAction>) => {
        return {requestQueue: [...(state.requestQueue || []), action.command]}
    }
)

