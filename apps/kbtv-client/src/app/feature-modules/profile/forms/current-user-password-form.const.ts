import { ConfirmPasswordControl, NewPasswordControl } from '@shared/constants/common-controls.const';
import { isSamePasswordsValidator } from '@shared/validators/is-same-passwords.validator';
import { DynamicFormBuilder } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable } from 'global-types';

export interface CurrentUserPasswordForm { oldPassword: string, newPassword: string, confirmPassword: string }

const builder = new DynamicFormBuilder<CurrentUserPasswordForm>();

const CurrentUserPasswordForm = builder.group()({ 
    viewOptions:{}, viewComponent: null, 
    validators$: [ 
        isSamePasswordsValidator<CurrentUserPasswordForm>("newPassword", "confirmPassword") 
    ],
    controls: {
        oldPassword: NewPasswordControl,
        newPassword: NewPasswordControl,
        confirmPassword: ConfirmPasswordControl
    }, 
    overrides: { 
        oldPassword: { viewOptions: { placeholder$: "Nåværende passord" } }
    }
});

export const CurrentUserPasswordFormSheet: Immutable<FormSheetViewConfig<CurrentUserPasswordForm>> = {
    formConfig: CurrentUserPasswordForm, 
    navConfig: {title: "Oppdater passord"},
    actionConfig: { submitText: "Oppdater", onlineRequired: true,}
}