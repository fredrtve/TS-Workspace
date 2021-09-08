import { ModelState } from '@core/state/model-state.interface';
import { _createReducers, _on } from 'state-management';
import { UserActions } from './actions.const';

export const UserReducers = _createReducers<ModelState>(
    _on(UserActions.setSaveUser, (state, action) => action.saveModelResult.modifiedState)
)