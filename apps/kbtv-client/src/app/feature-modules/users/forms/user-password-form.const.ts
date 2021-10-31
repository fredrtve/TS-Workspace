import { ConfirmPasswordControl, NewPasswordControl, UserNameControl } from "@shared/constants/common-controls.const";
import { isSamePasswordsValidator } from "@shared/validators/is-same-passwords.validator";
import { DynamicFormBuilder } from "dynamic-forms";
import { FormSheetViewConfig } from "form-sheet";
import { Immutable } from "global-types";

export interface UserPasswordForm { userName: string, newPassword: string, confirmPassword: string }

const builder = new DynamicFormBuilder<UserPasswordForm>();

export const UserPasswordForm = builder.group()({
    viewOptions: {}, viewComponent: null,
    controls: {
        userName: UserNameControl,
        newPassword: NewPasswordControl,
        confirmPassword: ConfirmPasswordControl,
    },
    validators$: [isSamePasswordsValidator<UserPasswordForm>("newPassword", "confirmPassword")],
    overrides: {
        userName: { disabled$: true }
    }
});

export const UserPasswordFormSheet: Immutable<FormSheetViewConfig<UserPasswordForm>> = {
    formConfig: UserPasswordForm, 
    navConfig: {title: "Oppdater passord"},  
    actionConfig: { submitText: "Oppdater", onlineRequired: true, getRawValue: true, }
}