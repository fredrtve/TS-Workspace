import { MissionType } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { NameControl } from '@shared/constants/common-controls.const';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

export interface CreateMissionTypeForm extends Pick<MissionType, "name"> {}

export const CreateMissionTypeModelForm: Immutable<ModelFormConfig<ModelState, MissionType, CreateMissionTypeForm>> = {
    includes: {prop: "missionTypes"}, 
    actionConverter: _appFormToSaveModelConverter,
    dynamicForm: {
        submitText: "Legg til",
        controls: { name: {...NameControl, required: true} } 
    }
}