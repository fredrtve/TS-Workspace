import { Validators } from '@angular/forms';
import { User } from '@core/models';
import { IContactable } from '@core/models/sub-interfaces/icontactable.interface';
import { IFullName } from '@core/models/sub-interfaces/ifullname.interface';
import { Roles } from '@core/roles.enum';
import { StateEmployers, StateUsers } from '@core/state/global-state.interfaces';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { EmailControl, EmployerSelectControl, FirstNameControl, LastNameControl, PhoneNumberControl, UserNameControl } from '@shared/constants/common-controls.const';
import { InputControlComponent, SelectControlComponent } from 'mat-dynamic-form-controls';
import { isUniqueAsyncValidator } from '@shared/validators/is-unique.async.validator';
import { DynamicFormBuilder } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';
import { _userFormToSaveUserConverter } from './user-form-to-save-user.converter';

export interface SaveUserForm extends Pick<User, "userName" | "role" | "employer">, IContactable, IFullName {
    password?: string;
}

type FormState = StateUsers & StateEmployers;

const builder = new DynamicFormBuilder<SaveUserForm, FormState>();

const AvailableRoles = Object.keys(Roles).filter(x => x !== Roles.Leder && x !== Roles.Admin).map(key => Roles[key as keyof typeof Roles]);

const RoleControl = builder.control<SelectControlComponent<string>>({
    required$: true, controlComponent: SelectControlComponent,
    viewOptions: {
        placeholder$: "Rolle",
        options$: AvailableRoles
    },  
});

const PasswordControl = builder.control({
    required$: true, controlComponent: InputControlComponent, 
    viewOptions: {placeholder$: "Passord", hideable$: true, defaultHidden$: true, autoComplete$: "new-password"},
    validators$: [
        Validators.minLength(ValidationRules.UserPasswordMinLength), 
        Validators.maxLength(ValidationRules.UserPasswordMaxLength)
    ] 
});

const hasUserNameBinding = builder.bindForm("userName", (name) => name != null, true);

export const UserModelForm: Immutable<ModelFormConfig<FormState, User,  SaveUserForm, FormState>> = {
    includes: {prop: "users", includes: ["employer"]}, 
    actionConverter: _userFormToSaveUserConverter,
    actionOptions: { getRawValue: true },
    dynamicForm: builder.form({
        controls: {
            userName: UserNameControl,
            password: PasswordControl,
            firstName: FirstNameControl,
            lastName: LastNameControl,
            role: RoleControl,
            employer: EmployerSelectControl,
            phoneNumber: PhoneNumberControl,
            email: EmailControl, 
        },
        overrides: { 
            firstName: { required$: true },
            lastName: { required$: true },
            password: { 
                controlClass$: builder.bindForm("userName", (name) => name != null ? "display-none" : "", true), 
                disabled$: builder.bindForm("userName", (name) => name != null, true) 
            },
            userName: { 
                disabled$: hasUserNameBinding,
                required$: true,     
                asyncValidators: [
                    builder.asyncValidator("users", (users$) => isUniqueAsyncValidator(users$, (x, y) => x.userName.toLowerCase() === y.toLowerCase()))
                ], 
            },
            employer: { 
                controlClass$: builder.bindForm("role", (role) => role !== Roles.Oppdragsgiver ? "display-none" : ""),
                viewOptions: { options$: builder.bindState("employers") } 
            }
        }
    })
}
