import { _createReducers, _on } from 'state-management';
import { DbActions } from './actions.const';

export const DbReducers = _createReducers(
    _on(DbActions.setPersistedState, (state, action) => action.state)
)
