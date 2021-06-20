import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppConfirmDialogService } from '@core/services/app-confirm-dialog.service';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { _getISO } from 'date-time-helpers';
import { FormService } from 'form-sheet';
import { SyncConfigFormSheet } from 'src/app/feature-modules/profile/forms/sync-config.form.const';
import { ProfileFacade } from '../profile.facade';
import { ProfileAction } from './profile-action.interface';
import { _syncFormToConfigConverter } from './sync-form-to-config.converter';

@Component({
  selector: 'app-sync-profile',
  templateUrl: './sync-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncProfileComponent {

  bottomActions: AppButton[];
  actions: ProfileAction[];
  
  constructor(
    private formService: FormService,
    private facade: ProfileFacade,
    private confirmService: AppConfirmDialogService,
  ){
    this.actions = [
      {text: 'Konfigurasjoner', icon: 'settings', callback: this.updateSyncConfig,
        hint: "Konfigurer synkronisering av data med skyen"},  
      {text: 'Synkroniser data', icon: 'update', callback: this.syncAll, 
        hint: 'Hent nye og oppdaterte data fra skyen.'},
      {text: 'Slett synkronisert data', icon: 'delete_sweep',callback: this.confirmPurge,
        hint: 'Slett synkronisert data fra enheten og last inn fra skyen på nytt.'},  
    ]
  }

  private updateSyncConfig = (): void => {
    const config = this.facade.syncConfig;
    this.formService.open(
      SyncConfigFormSheet, 
      { initialValue: config ? { initialMonthISO: _getISO(config.initialTimestamp), refreshTime: config.refreshTime / 60 } : null },
      (val) => this.facade.updateSyncConfig(_syncFormToConfigConverter(val))
    );
  }

  private confirmPurge = () => {
    this.confirmService.dialog$.subscribe(x => x.open({
      title: 'Bekreft sletting',
      message: 'All data vil bli lastet ned på nytt. Vær varsom ved bruk av mobildata.', 
      confirmText: 'Slett',
      confirmCallback: this.facade.reloadData
    }));
  }

  private syncAll = () => this.facade.syncAll();
  
}
