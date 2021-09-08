import { User } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { SaveModelPayload, SetSaveModelStatePayload } from "model/state-commands";
import { ModelFetcherActions } from "model/state-fetcher";
import { _createAction, _payload } from "state-management";

export const UserActions = {
    updatePassword: _createAction("Update Password", _payload<{ newPassword: string, userName: string }>()),   
    saveUser: _createAction("Save User", _payload<SaveUserPayload>()),   
    setSaveUser: _createAction("Set Save User", _payload<SetSaveUserPayload>()),
    fetch: ModelFetcherActions.fetch
}

export interface SaveUserPayload extends Omit<SaveModelPayload<ModelState, User>, "stateProp">{
    password: string,
}

export interface SetSaveUserPayload extends Omit<SetSaveModelStatePayload<ModelState, User>, "stateProp"> {
    password: string,
}