import { Validators } from '@angular/forms';
import { InboundEmailPassword } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { InputControlComponent } from 'mat-dynamic-form-controls';
import { DynamicFormBuilder } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

export interface CreateInboundEmailPasswordForm extends Pick<InboundEmailPassword, "password"> {}

const builder = new DynamicFormBuilder<InboundEmailPassword, ModelState>()

export const InboundEmailPasswordModelForm: Immutable<ModelFormConfig<ModelState, InboundEmailPassword, CreateInboundEmailPasswordForm>> = {
    includes: {prop: "inboundEmailPasswords"},
    actionConverter: _appFormToSaveModelConverter,
    dynamicForm: builder.form({
        controls: { 
            password: builder.control({
                controlComponent: InputControlComponent, required$: true,   
                viewOptions: { placeholder$: "Epostpassord" },
                validators$: [Validators.maxLength(ValidationRules.InboundEmailPasswordLength)] 
            })
        },
        overrides:{},
    })
}