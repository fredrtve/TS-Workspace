import { _createReducer } from '@state/helpers/create-reducer.helper';
import { Immutable } from '@global/interfaces';
import { StateAction } from '@state/state.action';

export const SetFetchedStateAction = "SET_FETCHED_STATE_ACTION";
export interface SetFetchedStateAction extends StateAction {
    state: Object
}

export const SetFetchedStateReducer = _createReducer(
    SetFetchedStateAction,
    (state: unknown, action: Immutable<SetFetchedStateAction>) => action.state,
)