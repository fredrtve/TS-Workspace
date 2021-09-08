import { User } from '@core/models';
import { Roles } from '@core/roles.enum';
import { ModelState } from '@core/state/model-state.interface';
import { Immutable } from 'global-types';
import { ModelFormResult } from 'model/form';
import { ModelCommand } from 'model/state-commands';
import { UserActions } from '../state/actions.const';
import { SaveUserForm } from './save-user-model-form.const';

export const _userFormToSaveUserConverter = (input: Immutable<ModelFormResult<ModelState, User, SaveUserForm>>) => {

    let {password, employer, ...entity} = input.formValue;
    let user: Partial<User> = entity;
    user.employerId = (entity.role !== Roles.Oppdragsgiver) ? undefined : employer?.id;

    if(input.saveAction === ModelCommand.Create)
        user.createdAt = new Date().getTime();

    return UserActions.saveUser({ 
        saveAction: input.saveAction,
        entity, 
        password: password!,     
    })
}