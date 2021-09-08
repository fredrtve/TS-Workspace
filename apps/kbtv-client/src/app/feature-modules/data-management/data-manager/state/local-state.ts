import { ModelState } from '@core/state/model-state.interface';
import { Prop } from 'global-types';
import { _createAction, _createReducers, _on, _payload } from 'state-management';

export const DataManagerLocalActions = {
    updateSelectedProperty: _createAction("Update Selected Property", _payload<{ selectedProperty: Prop<ModelState> }>()),
}

export const DataManagerLocalReducers = _createReducers(
    _on(DataManagerLocalActions.updateSelectedProperty, (state, action) => ({selectedProperty: action.selectedProperty}))
)