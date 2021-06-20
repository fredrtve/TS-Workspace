import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { MissionDocument } from '@core/models';
import { AppConfirmDialogService } from '@core/services/app-confirm-dialog.service';
import { DeviceInfoService } from '@core/services/device-info.service';
import { DownloaderService } from '@core/services/downloader.service';
import { ModelState } from '@core/state/model-state.interface';
import { FileFolder } from '@shared-app/enums/file-folder.enum';
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { _confirmDeleteDialogFactory } from '@shared-app/helpers/confirm-delete-dialog.factory';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { BaseSelectableContainerComponent } from '@shared-mission/components/base-selectable-container.component';
import { CreateMissionDocumentModelForm } from '@shared-mission/forms/create-mission-document-model-form.const';
import { EmailForm } from '@shared-mission/forms/email-form.const';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { FormService } from 'form-sheet';
import { ImmutableArray, Maybe } from 'global-types';
import { ModelFormService } from 'model/form';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectedMissionIdParam } from '../../mission-list/mission-list-route-params.const';
import { MissionDocumentListFacade } from '../mission-document-list.facade';

interface ViewModel { 
  documents: Maybe<ImmutableArray<MissionDocument>>, 
  isXs: boolean,  
  selectionsTitle: string
}

@Component({
  selector: 'app-mission-document-list',
  templateUrl: './mission-document-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDocumentListComponent extends BaseSelectableContainerComponent {

  vm$: Observable<ViewModel> = combineLatest([
    this.facade.getMissionDocuments$(this.missionId),
    this.deviceInfoService.isXs$,
    this.currentSelections$
  ]).pipe(
    map(([documents, isXs, selections]) => { return <ViewModel>{ 
      documents, isXs, 
      selectionsTitle: selections.length === 0 ? null :
        `${selections.length} dokument${selections.length === 1 ? '' : 'er'} valgt`,
    }})
  )

  private get missionId(): Maybe<string> { 
    return this.route.parent?.parent?.snapshot.paramMap.get(SelectedMissionIdParam) 
  }

  selectionBarConfig: MainTopNavConfig;

  actionFab: AppButton;

  constructor( 
    private deviceInfoService: DeviceInfoService,     
    private formService: FormService, 
    private downloaderService: DownloaderService,
    private facade: MissionDocumentListFacade,
    private route: ActivatedRoute,
    private confirmService: AppConfirmDialogService,
    private modelFormService: ModelFormService<ModelState>) {
      super();

      const can = RolePermissions.MissionDocumentList;

      this.actionFab = {
        icon: "note_add", aria: 'Legg til', callback: this.openDocumentForm, allowedRoles: can.create
      };

      this.selectionBarConfig = {
        customCancelFn: () => this.resetSelections(),
        buttons: [
          {icon: "send", aria: 'Send', callback: this.openMailDocumentSheet, allowedRoles: can.sendEmail}, 
          {icon: "delete_forever", aria: 'Slett', color: 'warn', callback: this.openConfirmDeleteDialog, allowedRoles: can.delete}
        ]
      }
    }

  downloadDocument = (document: MissionDocument) => 
    document.fileName ? 
    this.downloaderService.downloadUrl(_appFileUrl(document.fileName, FileFolder.Documents)) : null;

  trackByFn = (index: number, entity: MissionDocument) => entity.id

  private deleteSelectedDocuments = () => {
    this.facade.delete({ids: this.currentSelections});    
    this.selectableContainer.resetSelections();
  }

  private openConfirmDeleteDialog = () => {   
    this.confirmService.dialog$.subscribe(x => 
      x.open(_confirmDeleteDialogFactory("utvalgte dokumenter", this.deleteSelectedDocuments))
    )
  }
  
  private openMailDocumentSheet = () => {
    const email = this.facade.getMissionEmployerEmail(this.missionId)
    this.formService.open<EmailForm, null>(
      {
        formConfig: {...EmailForm, options: { allowPristine: email != null } }, 
        navConfig: {title: "Send Dokumenter"},
      }, 
      { initialValue: { email } },
      (val) => { 
        this.facade.mailDocuments(val.email, this.currentSelections);
        this.selectableContainer.resetSelections();
      }
    )
  }

  private openDocumentForm = () => 
    this.modelFormService.open(CreateMissionDocumentModelForm, {missionId: this.missionId || undefined});

}
