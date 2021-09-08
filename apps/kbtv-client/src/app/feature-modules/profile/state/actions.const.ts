import { User } from "@core/models";
import { CurrentUser } from "state-auth";
import { _createAction, _payload } from "state-management";
import { SyncActions } from "state-sync";

export const ProfileActions = {
    clearAndLogout: _createAction("Clear And Logout"),
    updateUser: _createAction("Update Current User", _payload<{ user: Partial<User & CurrentUser> }>()),
    updatePassword: _createAction("Update Password", _payload<{ oldPassword: string, newPassword: string }>()),
    updateSyncConfig: SyncActions.updateConfig,
    reloadSyncState: SyncActions.reloadState,
    sync: SyncActions.sync,
}
