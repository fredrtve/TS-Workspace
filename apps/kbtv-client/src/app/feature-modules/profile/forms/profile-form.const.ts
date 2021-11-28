import { Validators } from '@angular/forms';
import { User } from '@core/models';
import { IContactable } from '@core/models/sub-interfaces/icontactable.interface';
import { IFullName } from '@core/models/sub-interfaces/ifullname.interface';
import { EmailControl, FirstNameControl, LastNameControl, PhoneNumberControl, UserNameControl } from '@shared/constants/common-controls.const';
import { DynamicFormBuilder } from '@fretve/dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable } from '@fretve/global-types';

export interface ProfileForm extends Pick<User, "userName">, IContactable, IFullName {}

const builder = new DynamicFormBuilder<ProfileForm>();

const ProfileForm = builder.group()({
    viewOptions:{}, viewComponent: null,
    controls: {
        userName: UserNameControl,
        firstName: FirstNameControl,
        lastName: LastNameControl,
        phoneNumber: PhoneNumberControl,
        email: EmailControl,
    },
    overrides: {
        userName: { required$: true, disabled$: true },
        firstName: { required$: true, disabled$: true },
        lastName: { required$: true, disabled$: true }
    }
});

export const ProfileFormSheet: Immutable<FormSheetViewConfig<ProfileForm>> = {
    formConfig: ProfileForm, 
    navConfig: { title: "Oppdater profil" },
    actionConfig: { submitText: "Oppdater", getRawValue: true, onlineRequired: true, }
  }