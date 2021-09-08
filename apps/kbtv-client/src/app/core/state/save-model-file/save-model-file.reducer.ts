import { GlobalActions } from '@core/global-actions';
import { _on } from 'state-management';

export const SaveModelFileReducer = _on(
    GlobalActions.setSaveModelFile, 
    (state, action) => action.saveModelResult.modifiedState
);


