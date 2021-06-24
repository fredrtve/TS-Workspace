import { User } from '@core/models';
import { Roles } from '@core/roles.enum';
import { ModelState } from '@core/state/model-state.interface';
import { Converter, ModelFormResult } from 'model/form';
import { ModelCommand } from 'model/state-commands';
import { SaveUserAction } from '../state/actions.const';
import { SaveUserForm } from './save-user-model-form.const';

export const _userFormToSaveUserConverter: Converter<ModelFormResult<ModelState, User, SaveUserForm>, SaveUserAction> = (input) => {

    let {password, employer, ...entity} = input.formValue;
    let user: Partial<User> = entity;
    user.employerId = (entity.role !== Roles.Oppdragsgiver) ? undefined : employer?.id;

    if(input.saveAction === ModelCommand.Create)
        user.createdAt = new Date().getTime();

    return <SaveUserAction>{ 
        type: SaveUserAction, 
        stateProp:"users", 
        saveAction: input.saveAction,
        entity, password,     
    }
}