import { UnknownState } from 'global-types';
import { StateAction } from 'state-management'
import { SyncConfig, SyncResponse, SyncStateConfig } from '../interfaces';

export const SyncStateAction = "SYNC_STATE_ACTION";
export interface SyncStateAction extends StateAction<typeof SyncStateAction> { }

export const SyncStateSuccessAction = "SYNC_STATE_SUCCESS_ACTION";
export interface SyncStateSuccessAction extends StateAction<typeof SyncStateSuccessAction> {
    response: SyncResponse<UnknownState>,
    syncStateConfig: SyncStateConfig<UnknownState>
}   

export const SyncStateFailedAction = "SYNC_STATE_FAILED_ACTION"; 
export interface SyncStateFailedAction extends StateAction<typeof SyncStateFailedAction> {}

export const UpdateSyncConfigAction = "UPDATE_SYNC_CONFIG_ACTION";
export interface UpdateSyncConfigAction extends StateAction<typeof UpdateSyncConfigAction> {
    syncConfig: SyncConfig
}   

export const WipeSyncStateAction = "WIPE_SYNC_STATE_ACTION";
export interface WipeSyncStateAction extends StateAction<typeof WipeSyncStateAction> {
    syncStateConfig: SyncStateConfig<UnknownState>
}

export const ReloadSyncStateAction = "RELOAD_SYNC_STATE_ACTION";
export interface ReloadSyncStateAction extends StateAction<typeof ReloadSyncStateAction> { }