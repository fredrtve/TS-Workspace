import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmDialogService } from '@core/services/app-confirm-dialog.service';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { FormService } from 'form-sheet';
import { CurrentUserPasswordForm, CurrentUserPasswordFormSheet } from '../forms/current-user-password-form.const';
import { ProfileForm, ProfileFormSheet } from '../forms/profile-form.const';
import { ProfileFacade } from '../profile.facade';
import { ProfileAction } from './profile-action.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  
  bottomActions: AppButton[];

  actions: ProfileAction[];
  
  constructor(
    private formService: FormService,
    private facade: ProfileFacade,
    private confirmService: AppConfirmDialogService,
    private router: Router,
    private route: ActivatedRoute,
  ){
    this.actions = [
      {text: 'Oppdater profil', icon: 'account_circle', callback: this.updateProfile},
      {text: 'Oppdater passord', icon: 'vpn_key', callback: this.updatePassword},    
      {text: "Aktivitetslogg", icon: "rule", callback: this.goToRequestLog,
        hint: "Logg over aktiviteter utført denne økten."},
      {text: "Synkronisering", icon: 'update', callback: this.goToSyncProfile,
        hint: "Valg relatert til synkronisering av data"},      
      {text: 'Slett lokal data', icon: 'delete_sweep', callback: this.confirmClear,
        hint: "Du vil bli logget ut og må laste ned data på nytt ved neste økt."},  
      {text: 'Logg ut', icon: 'power_settings_new', callback: this.logout},   
    ]
  }

  private updateProfile = (): void => {
    this.formService.open<ProfileForm>(
      ProfileFormSheet, 
      { initialValue: this.facade.currentUser },
      (val) => this.facade.updateCurrentUser(val)
    );
  }

  private updatePassword = (): void => {
    this.formService.open(
      CurrentUserPasswordFormSheet, {},
      (val: CurrentUserPasswordForm) => this.facade.updatePassword(val.oldPassword, val.newPassword)
    )
  }

  private confirmClear = (): void => {
    this.confirmService.dialog$.subscribe(x => x.open({
      title: 'Bekreft sletting',
      message: 'Lokale innstillinger vil bli borte og all data må lastes ned på nytt. Vær varsom ved bruk av mobildata.', 
      confirmText: 'Slett',
      confirmCallback: () => this.facade.clearAndLogout()
    }));
  }

  private goToRequestLog = () => this.router.navigate(['aktivitetslogg']);

  private logout = () => this.facade.logout(); 

  private goToSyncProfile = () => this.router.navigate(['synkronisering'],{relativeTo: this.route})
  
}
