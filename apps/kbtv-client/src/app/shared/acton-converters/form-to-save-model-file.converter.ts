import { Model, ModelFile } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { FormToSaveModelConverter, ModelFormToSaveModelInput } from 'model/form';
import { _flattenExistingForeigns } from '@shared-app/helpers/flatten-existing-foreigns.helper';
import { _modelIdGenerator } from '@shared-app/helpers/id/model-id-generator.helper';
import { ModelStateConfig } from 'model/state';
import { ModelFileWrapper } from '@shared/model-file.wrapper';
import { SaveModelFileAction } from '@actions/global-actions';

export type ModelFileForm = ModelFile & {file: File};
export const _formToSaveModelFileConverter: FormToSaveModelConverter<ModelFileForm, ModelState, SaveModelFileAction<ModelFile>> =
    <TForm extends ModelFileForm>(input: ModelFormToSaveModelInput<TForm, ModelState>): SaveModelFileAction<ModelFile> => {

    const clone = {...input.formValue, file: undefined};
    var entity = _flattenExistingForeigns<ModelFile>(input.stateProp, clone, input.options);
    entity = _modelIdGenerator(input.stateProp, entity); 

    const modelCfg = ModelStateConfig.get(input.stateProp);
    const fileWrapper = 
        new ModelFileWrapper(input.formValue.file, entity[modelCfg.idProp]);

    return <SaveModelFileAction<Model>>{
        type: SaveModelFileAction,
        stateProp: input.stateProp, 
        entity, 
        fileWrapper, 
        saveAction: input.saveAction
    }
}