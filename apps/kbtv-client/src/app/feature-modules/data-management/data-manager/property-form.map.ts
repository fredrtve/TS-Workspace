import { ModelState } from '@core/state/model-state.interface';
import { MissionModelForm } from '@shared-mission/forms/save-mission-model-form.const';
import { Immutable } from '@fretve/global-types';
import { ModelFormConfig } from 'model/form';
import { EmployerModelForm } from '../forms/employer-model-form.const';
import { InboundEmailPasswordModelForm } from '../forms/inbound-email-password-model-form.const';

export const PropertyFormMap: {[key: string]: Immutable<ModelFormConfig<ModelState, any, any>> } = {
    "employers": EmployerModelForm,
    "inboundEmailPasswords": InboundEmailPasswordModelForm,
    "missions": MissionModelForm,
}