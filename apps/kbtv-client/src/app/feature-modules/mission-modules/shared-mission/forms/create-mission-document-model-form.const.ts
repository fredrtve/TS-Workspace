import { MissionDocument } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { NameControl } from '@shared/constants/common-controls.const';
import { _formToSaveModelFileConverter } from '@shared/constants/form-to-save-model-file.converter';
import { FileFieldComponent } from '@fretve/mat-dynamic-form-controls';
import { fileExtensionValidator } from '@shared/validators/file-extension.validator';
import { fileSizeValidator } from '@shared/validators/file-size.validator';
import { DynamicFormBuilder } from '@fretve/dynamic-forms';
import { Immutable } from '@fretve/global-types';
import { ModelFormConfig } from 'model/form';

export interface CreateMissionDocumentForm extends Pick<MissionDocument, "name" | "missionId">{
    fileList: {[index: number]: File};
}

const builder = new DynamicFormBuilder<CreateMissionDocumentForm, ModelState>();

export const CreateMissionDocumentModelForm: Immutable<ModelFormConfig<ModelState, MissionDocument, CreateMissionDocumentForm>> = {
    stateProp: "missionDocuments", 
    actionConverter: _formToSaveModelFileConverter,
    dynamicForm: builder.group()({
        viewOptions:{}, viewComponent: null,
        controls: { 
            missionId:  { required$: true, viewOptions: {} },
            name: NameControl, 
            fileList: builder.field({
                viewComponent: FileFieldComponent, required$: true, viewOptions: {},
                validators$: [
                    fileExtensionValidator(ValidationRules.MissionDocumentFileExtensions),
                    fileSizeValidator(ValidationRules.ContentMaxByteLength)
                ]
            }),
        },
        overrides: {
            name: { required$: true, }
        }
    })
}