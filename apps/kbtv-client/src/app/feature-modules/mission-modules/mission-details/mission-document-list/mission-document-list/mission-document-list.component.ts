import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { MissionDocument } from '@core/models';
import { AppConfirmDialogService } from '@core/services/app-confirm-dialog.service';
import { DownloaderService } from '@core/services/downloader.service';
import { ModelState } from '@core/state/model-state.interface';
import { FileFolder } from '@shared-app/enums/file-folder.enum';
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { _confirmDeleteDialogFactory } from '@shared-app/helpers/confirm-delete-dialog.factory';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { CreateMissionDocumentModelForm } from '@shared-mission/forms/create-mission-document-model-form.const';
import { EmailForm } from '@shared-mission/forms/email-form.const';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { CdkSelectableContainerDirective } from 'cdk-selectable';
import { FormService } from 'form-sheet';
import { ModelFormService } from 'model/form';
import { MissionDetailsFacade } from '../../mission-details.facade';

@Component({
  selector: 'app-mission-document-list',
  templateUrl: './mission-document-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDocumentListComponent {
  @ViewChild('selectableContainer', {read: CdkSelectableContainerDirective}) 
    selectableContainer: CdkSelectableContainerDirective<string>;
    
  documents$ = this.facade.getChildren$("missionDocuments");

  selectionBarConfig: MainTopNavConfig;
  
  selectionTitle: string | undefined;

  actionFab: AppButton;

  constructor(   
    private formService: FormService, 
    private downloaderService: DownloaderService,
    private facade: MissionDetailsFacade,
    private confirmService: AppConfirmDialogService,
    private modelFormService: ModelFormService<ModelState>) {
      const can = RolePermissions.MissionDocumentList;

      this.actionFab = {
        icon: "note_add", aria: 'Legg til', callback: this.openDocumentForm, allowedRoles: can.create
      };

      this.selectionBarConfig = {
        optimisitcSpinnerDisabled: true,
        customCancelFn: () => this.selectableContainer.resetSelections(),
        buttons: [
          {icon: "send", aria: 'Send', callback: this.openMailDocumentSheet, allowedRoles: can.sendEmail}, 
          {icon: "delete_forever", aria: 'Slett', color: 'warn', callback: this.openConfirmDeleteDialog, allowedRoles: can.delete}
        ]
      }
    }

  onSelectionChange(selections: string[]): void{
    this.selectionTitle = selections.length === 0 ? undefined :
      `${selections.length} dokument${selections.length === 1 ? '' : 'er'} valgt`
  }

  downloadDocument = (document: MissionDocument) => 
    document.fileName ? 
    this.downloaderService.downloadUrl(_appFileUrl(document.fileName, FileFolder.Documents)) : null;

  trackByFn = (index: number, entity: MissionDocument) => entity.id

  private deleteSelectedDocuments = () => {
    this.facade.deleteChildren("missionDocuments", {ids: this.selectableContainer.getSelectedIds()});    
    this.selectableContainer.resetSelections();
  }

  private openConfirmDeleteDialog = () => {   
    this.confirmService.dialog$.subscribe(x => 
      x.open(_confirmDeleteDialogFactory("utvalgte dokumenter", this.deleteSelectedDocuments))
    )
  }
  
  private openMailDocumentSheet = () => {
    const email = this.facade.getEmployerEmail()
    this.formService.open<EmailForm, null>(
      {
        formConfig: {...EmailForm, options: { allowPristine: email != null } }, 
        navConfig: {title: "Send dokumenter"},
      }, 
      { initialValue: { email } },
      (val) => { 
        this.facade.mailChildren("missionDocuments", val.email, this.selectableContainer.getSelectedIds());
        this.selectableContainer.resetSelections();
      }
    )
  }

  private openDocumentForm = () => 
    this.modelFormService.open(CreateMissionDocumentModelForm, {missionId: this.facade.missionId || undefined});

}
