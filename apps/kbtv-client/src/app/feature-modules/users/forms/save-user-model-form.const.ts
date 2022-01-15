import { Validators } from '@angular/forms';
import { User } from '@core/models';
import { IContactable } from '@core/models/sub-interfaces/icontactable.interface';
import { IFullName } from '@core/models/sub-interfaces/ifullname.interface';
import { Roles } from '@core/roles.enum';
import { StateEmployers, StateUsers } from '@core/state/global-state.interfaces';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { EmailControl, EmployerSelectControl, FirstNameControl, LastNameControl, PhoneNumberControl, UserNameControl } from '@shared/constants/common-controls.const';
import { InputFieldComponent, SelectFieldComponent } from '@fretve/mat-dynamic-form-controls';
import { isUniqueAsyncValidator } from '@shared/validators/is-unique.async.validator';
import { DynamicFormBuilder } from '@fretve/dynamic-forms';
import { Immutable } from '@fretve/global-types';
import { ModelFormConfig } from 'model/form';
import { _userFormToSaveUserConverter } from './user-form-to-save-user.converter';
import { map } from 'rxjs/operators';

export interface SaveUserForm extends Pick<User, "userName" | "role" | "employer">, IContactable, IFullName {
    password?: string;
}

type FormState = StateUsers & StateEmployers;

const builder = new DynamicFormBuilder<SaveUserForm, FormState>();

const AvailableRoles = Object.keys(Roles).filter(x => x !== Roles.Leder && x !== Roles.Admin).map(key => Roles[key as keyof typeof Roles]);

const RoleControl = builder.field<SelectFieldComponent<string>>({
    required$: true, viewComponent: SelectFieldComponent,
    viewOptions: {
        placeholder$: "Rolle",
        options$: AvailableRoles
    },  
});

const PasswordControl = builder.field({
    required$: true, viewComponent: InputFieldComponent, 
    viewOptions: {placeholder$: "Passord", hideable$: true, defaultHidden$: true, autoComplete$: "new-password"},
    validators$: [
        Validators.minLength(ValidationRules.UserPasswordMinLength), 
        Validators.maxLength(ValidationRules.UserPasswordMaxLength)
    ] 
});

const hasUserNameBinding = builder.bindForm("userName", (name) => name != null, {onlyOnce: true});

export const UserModelForm: Immutable<ModelFormConfig<FormState, User,  SaveUserForm, FormState>> = {
    stateProp: "users",
    includes: x => x.include("employer"), 
    actionConverter: _userFormToSaveUserConverter,
    actionOptions: { getRawValue: true },
    dynamicForm: builder.group()({
        viewOptions: {}, viewComponent: null,
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
                controlClass$: builder.bindForm("userName", (name) => name != null ? "display-none" : "", {onlyOnce: true}), 
                disabled$: builder.bindForm("userName", (name) => name != null, {onlyOnce: true}) 
            },
            userName: { 
                disabled$: hasUserNameBinding,
                required$: true,     
                asyncValidators: [
                    builder.asyncValidator([], ["users"], (f$,s$) => 
                        isUniqueAsyncValidator(s$.pipe(map(x => x.users)), (x, y) => x.userName.toLowerCase() === y.toLowerCase()))
                ], 
            },
            employer: { 
                controlClass$: builder.bindForm("role", (role) => role !== Roles.Oppdragsgiver ? "display-none" : ""),
                viewOptions: { options$: builder.bindState("employers") } 
            }
        }
    })
}
