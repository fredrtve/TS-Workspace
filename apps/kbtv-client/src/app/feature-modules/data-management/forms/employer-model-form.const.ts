import { Employer } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { EmailControl, GoogleAddressControl, NameControl, PhoneNumberControl } from '@shared/constants/common-controls.const';
import { DynamicFormBuilder } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

export interface CreateEmployerForm extends Pick<Employer, "name" | "phoneNumber" | "address" | "email"> {}

const builder = new DynamicFormBuilder<Employer, ModelState>()

export const EmployerModelForm: Immutable<ModelFormConfig<ModelState, Employer>> = {
    stateProp: "employers",
    actionConverter: _appFormToSaveModelConverter,
    dynamicForm: builder.group()({
        viewOptions: {},
        controls: {
            name: NameControl, 
            phoneNumber: PhoneNumberControl, 
            address: GoogleAddressControl, 
            email: EmailControl
        },
        overrides: {
            name: { required$: true, }
        }
    })
}