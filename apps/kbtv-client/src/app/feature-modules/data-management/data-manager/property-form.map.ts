import { Model } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { DynamicForm } from 'dynamic-forms';
import { OptionsFormState } from 'form-sheet';
import { CreateEmployerForm } from '@shared/constants/model-forms/create-employer-form.const';
import { CreateInboundEmailPasswordForm } from '@shared/constants/model-forms/create-inbound-email-password-form.const';
import { CreateMissionTypeForm } from '@shared/constants/model-forms/create-mission-type-form.const';
import { CreateMissionForm } from '@shared/constants/model-forms/save-mission-forms.const';
import { Immutable } from 'global-types';

export const PropertyFormMap: {[key: string]: Immutable<DynamicForm<Model, OptionsFormState<ModelState>>> } = {
    "employers": CreateEmployerForm,
    "missionTypes": CreateMissionTypeForm,
    "inboundEmailPasswords": CreateInboundEmailPasswordForm,
    "missions": CreateMissionForm,
}