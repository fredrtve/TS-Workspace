import { UnknownState } from 'global-types';
import { _createAction, _payload } from 'state-management';
import { SyncConfig, SyncResponse, SyncStateConfig } from '../interfaces';

export const SyncActions = {
    sync: _createAction("Sync State"),
    reloadState: _createAction("Reload Sync State"),
    updateConfig: _createAction("Update Sync Config", _payload<{ syncConfig: SyncConfig }>()),
    wipeState: _createAction("Wipe Sync State", _payload<{syncStateConfig: SyncStateConfig<UnknownState>}>()),
    syncFailed: _createAction("Sync State Failed"),
    syncSuccess: _createAction(
        "Sync State Success", 
        _payload<{response: SyncResponse<UnknownState>, syncStateConfig: SyncStateConfig<UnknownState>}>()
    ),
}