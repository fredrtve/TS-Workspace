import { ModelState } from '@core/state/model-state.interface';
import { MissionModelForm } from '@shared-mission/forms/save-mission-model-form.const';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';
import { EmployerModelForm } from '../forms/employer-model-form.const';
import { InboundEmailPasswordModelForm } from '../forms/inbound-email-password-model-form.const';
import { MissionTypeModelForm } from '../forms/mission-type-model-form.const';

export const PropertyFormMap: {[key: string]: Immutable<ModelFormConfig<ModelState, any, any>> } = {
    "employers": EmployerModelForm,
    "missionTypes": MissionTypeModelForm,
    "inboundEmailPasswords": InboundEmailPasswordModelForm,
    "missions": MissionModelForm,
}