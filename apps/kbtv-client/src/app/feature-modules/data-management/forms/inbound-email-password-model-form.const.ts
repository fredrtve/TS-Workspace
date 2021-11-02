import { Validators } from '@angular/forms';
import { InboundEmailPassword } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { InputFieldComponent } from 'mat-dynamic-form-controls';
import { DynamicFormBuilder } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

export interface CreateInboundEmailPasswordForm extends Pick<InboundEmailPassword, "password"> {}

const builder = new DynamicFormBuilder<InboundEmailPassword, ModelState>()

export const InboundEmailPasswordModelForm: Immutable<ModelFormConfig<ModelState, InboundEmailPassword, CreateInboundEmailPasswordForm>> = {
    stateProp: "inboundEmailPasswords",
    actionConverter: _appFormToSaveModelConverter,
    dynamicForm: builder.group()({
        viewOptions:{}, viewComponent: null,
        controls: { 
            password: builder.field({
                viewComponent: InputFieldComponent, required$: true,   
                viewOptions: { placeholder$: "Epostpassord" },
                validators$: [Validators.maxLength(ValidationRules.InboundEmailPasswordLength)] 
            })
        },
        overrides:{},
    })
}