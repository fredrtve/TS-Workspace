import { Immutable } from '@fretve/global-types';
import { _deleteModel } from 'model/core';
import { _createReducers, _on } from 'state-management';
import { DeleteModelPayload, ModelCommands } from './actions';

export const ModelCommandReducers = _createReducers(
    _on(ModelCommands.delete, (state, action: Immutable<DeleteModelPayload<any,any>>) => 
        _deleteModel<any,any>(state, action.stateProp, {...action.payload})),
    _on(ModelCommands.setSave, (state, action) => action.saveModelResult.modifiedState),
)
