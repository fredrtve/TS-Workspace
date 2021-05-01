import { Employer } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { _googleAddressFormatter } from '@shared-app/helpers/google-address-formatter.helper';
import { _formToSaveModelConverter } from '@shared/action-converters/form-to-save-model.converter';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';
import { EmailControl, GoogleAddressControl, NameControl, PhoneNumberControl } from '../common-controls.const';

export interface CreateEmployerForm extends Pick<Employer, "name" | "phoneNumber" | "address" | "email"> {}

export const CreateEmployerModelForm: Immutable<ModelFormConfig<ModelState, Employer>> = {
    includes: {prop: "employers"},
    actionConverter: _formToSaveModelConverter,
    dynamicForm: {
        submitText: "Legg til",
        controls: {
            name: {...NameControl, required: true}, 
            phoneNumber: PhoneNumberControl, 
            address: GoogleAddressControl, 
            email: EmailControl
        },
        onSubmitFormatter: _googleAddressFormatter
    }
}