import { User } from '@core/models';
import { StateCurrentUser } from '@core/state/global-state.interfaces';
import { CurrentUser } from 'state-auth';
import { _createReducers, _on } from 'state-management';
import { ProfileActions } from './actions.const';

export const ProfileReducers = _createReducers<StateCurrentUser>(
    _on(ProfileActions.updateUser, (state, action) => ({
        currentUser: <User & CurrentUser>(state.currentUser ? {...state.currentUser, ...action.user} : action.user) 
    }))
)