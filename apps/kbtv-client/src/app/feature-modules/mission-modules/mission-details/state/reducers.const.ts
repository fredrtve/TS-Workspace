import { StateMissions } from '@core/state/global-state.interfaces';
import { _update } from 'array-helpers';
import { _createReducer } from 'state-management';
import { UpdateLastVisitedAction } from './actions.const';

export const UpdateLastVisitedReducer = _createReducer<StateMissions, UpdateLastVisitedAction>(
    UpdateLastVisitedAction,
    (state, {id}) => !state.missions ? undefined :
        { missions: _update(state.missions, { id, lastVisited: new Date().getTime() }, "id") }   
)
