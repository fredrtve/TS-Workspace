import { ModelState } from '@core/state/model-state.interface';
import { CreateMissionModelForm } from '@shared-mission/forms/save-mission-model-form.const';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';
import { CreateEmployerModelForm } from '../forms/create-employer-model-form.const';
import { CreateInboundEmailPasswordModelForm } from '../forms/create-inbound-email-password-model-form.const';
import { CreateMissionTypeModelForm } from '../forms/create-mission-type-model-form.const';

export const PropertyFormMap: {[key: string]: Immutable<ModelFormConfig<ModelState, any, object, object | null>> } = {
    "employers": CreateEmployerModelForm,
    "missionTypes": CreateMissionTypeModelForm,
    "inboundEmailPasswords": CreateInboundEmailPasswordModelForm,
    "missions": CreateMissionModelForm,
}