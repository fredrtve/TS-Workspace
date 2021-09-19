import { GlobalActions } from '@core/global-actions';
import { ModelFile } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { Immutable, UnknownState } from 'global-types';
import { _getModelConfig } from 'model/core';
import { ModelFormResult } from 'model/form';

export type ModelFileForm = {file: File};
type FormResult = ModelFormResult<ModelState, ModelFile, ModelFileForm>

export const _formToSaveModelFileConverter = (input: Immutable<FormResult>) => {
    let {file, ...entity} = input.formValue;
    const idProp = _getModelConfig<ModelState, ModelFile>(input.stateProp).idProp;
    return GlobalActions.saveModelFile({
        stateProp: input.stateProp,    
        file, 
        entity: (<UnknownState> input.formValue)[idProp] != null ? 
            entity : 
            { ...entity, createdAt: new Date().getTime() }, 
     
    })
}