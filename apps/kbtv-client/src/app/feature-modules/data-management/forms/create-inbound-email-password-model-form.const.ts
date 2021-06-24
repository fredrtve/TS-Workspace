import { Validators } from '@angular/forms';
import { InboundEmailPassword } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { InputQuestionComponent, InputQuestion } from '@shared/scam/dynamic-form-questions/input-question.component';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

export interface CreateInboundEmailPasswordForm extends Pick<InboundEmailPassword, "password"> {}

export const CreateInboundEmailPasswordModelForm: Immutable<ModelFormConfig<ModelState, InboundEmailPassword, CreateInboundEmailPasswordForm>> = {
    includes: {prop: "inboundEmailPasswords"},
    actionConverter: _appFormToSaveModelConverter,
    dynamicForm: {
        submitText: "Legg til",
        controls: { 
            password: { required: true,
                questionComponent: InputQuestionComponent,    
                question: <InputQuestion> { placeholder: "Epostpassord" },
                validators: [Validators.maxLength(250)] 
            } 
        },
    }
}