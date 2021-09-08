import { Injectable } from "@angular/core";
import { Immutable } from "global-types";
import { AuthService } from "state-auth";
import { Store } from 'state-management';
import { SyncActions, SyncConfig } from 'state-sync';
import { ProfileForm } from "./forms/profile-form.const";
import { ProfileActions } from "./state/actions.const";
import { StoreState } from './store-state';

@Injectable({providedIn: 'any'})
export class ProfileFacade {

  get currentUser() {
    return this.store.state.currentUser
  };

  get syncConfig() {
    return this.store.state.syncConfig
  };

  constructor(
    private store: Store<StoreState>,
    private authService: AuthService
  ) {}
  
  updateCurrentUser = (user: Immutable<ProfileForm>): void => 
    this.store.dispatch(ProfileActions.updateUser({ user }));
  
  updatePassword = (oldPassword: string, newPassword: string) => 
    this.store.dispatch(ProfileActions.updatePassword({ oldPassword, newPassword }));
  
  updateSyncConfig = (syncConfig: Immutable<SyncConfig>) => 
    this.store.dispatch(SyncActions.updateConfig({ syncConfig }));
  
  syncAll = () => this.store.dispatch(SyncActions.sync());

  reloadData = () => this.store.dispatch(SyncActions.reloadState());

  logout = () => this.authService.logout(); 

  clearAndLogout = () => this.store.dispatch(ProfileActions.clearAndLogout())
  
}
