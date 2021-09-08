import { GlobalActions } from '@core/global-actions';
import { ModelFile } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { Immutable } from 'global-types';
import { ModelFormResult } from 'model/form';
import { ModelCommand } from 'model/state-commands';

export type ModelFileForm = {file: File};
type FormResult = ModelFormResult<ModelState, ModelFile, ModelFileForm>

export const _formToSaveModelFileConverter = (input: Immutable<FormResult>) => {
    let {file, ...entity} = input.formValue;
    return GlobalActions.saveModelFile({
        stateProp: input.stateProp,    
        saveAction: input.saveAction,  
        file, 
        entity: input.saveAction !== ModelCommand.Create ? 
            entity : 
            { ...entity, createdAt: new Date().getTime() }, 
     
    })
}