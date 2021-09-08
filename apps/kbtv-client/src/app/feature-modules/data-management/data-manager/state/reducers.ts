import { _createReducers, _on } from 'state-management';
import { DataManagerLocalActions } from './actions';

export const DataManagerLocalReducers = _createReducers(
    _on(DataManagerLocalActions.updateSelectedProperty, (state, action) => ({selectedProperty: action.selectedProperty}))
)