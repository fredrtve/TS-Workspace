import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { RolePermissions } from "@core/configurations/role-permissions.const";
import { MissionImage, ModelFile } from '@core/models';
import { AppConfirmDialogService } from "@core/services/app-confirm-dialog.service";
import { DownloaderService } from '@core/services/downloader.service';
import { FileFolder } from "@shared-app/enums/file-folder.enum";
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { _confirmDeleteDialogFactory } from "@shared-app/helpers/confirm-delete-dialog.factory";
import { _trackByModel } from "@shared-app/helpers/trackby/track-by-model.helper";
import { AppButton } from "@shared-app/interfaces/app-button.interface";
import { ImageViewerDialogService } from "@shared-mission/components/image-viewer/image-viewer-dialog.service";
import { EmailForm } from '@shared-mission/forms/email-form.const';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { CdkSelectableContainerDirective } from "cdk-selectable";
import { FormService } from "form-sheet";
import { ImmutableArray } from 'global-types';
import { MissionDetailsFacade } from "../../mission-details.facade";

@Component({
  selector: "app-mission-image-list",
  templateUrl: "./mission-image-list.component.html",
  styleUrls: ["./mission-image-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionImageListComponent{
  @ViewChild('imageInput') imageInput: ElementRef<HTMLElement>;
  @ViewChild('selectableContainer', {read: CdkSelectableContainerDirective}) 
    selectableContainer: CdkSelectableContainerDirective<string>;

  private can = RolePermissions.MissionImageList;

  FileFolder = FileFolder;
  
  images$ = this.facade.getChildren$("missionImages");
  
  selectionTitle: string | undefined;

  actionFab: AppButton;

  bottomActions: AppButton[];

  selectionBarConfig: MainTopNavConfig;

  private images: ImmutableArray<MissionImage>;

  constructor( 
    private downloaderService: DownloaderService,
    private formService: FormService,
    private confirmService: AppConfirmDialogService,
    private imageViewer: ImageViewerDialogService,
    private facade: MissionDetailsFacade) {
      this.actionFab = 
        {icon: "camera_enhance", aria: 'Ta bilde', callback: this.openImageInput, allowedRoles: this.can.create};

      this.selectionBarConfig = {
        customCancelFn: () => this.selectableContainer.resetSelections(),
        buttons: [
          {icon: "send", aria: 'Send', callback: () => this.openMailImageSheet(this.selectableContainer.getSelectedIds()), allowedRoles: this.can.sendEmail}, 
          {icon: "delete_forever", aria: 'Slett', color: 'warn', callback: this.openConfirmDeleteDialog, allowedRoles: this.can.delete}
        ]
      }

      this.bottomActions = [
        {icon: 'send', text: 'Send', callback: () => this.openMailImageSheet(<string[]> this.images?.map(x => x.id)), allowedRoles: this.can.sendEmail},
        {icon: "cloud_download", text: "Last ned", callback: () => this.downloadImages(this.images)},
      ]
    }

  onSelectionChange(selections: string[]): void {
    this.selectionTitle = selections.length === 0 ? undefined :
      `${selections.length} bilde${selections.length === 1 ? '' : 'r'} valgt`;
  }

  openImageViewer(currentImage: ModelFile, images: ModelFile[]): void {
    this.imageViewer.open({
      currentImage, images, fileFolder: FileFolder.MissionImage, downloadFolder: FileFolder.MissionImageOriginal,
      deleteAction: { 
        callback: (id: string) => this.deleteImages({id}),
        allowedRoles: RolePermissions.MissionImageList.delete
      }
    })
  }

  uploadImages = (files: FileList): void => this.facade.addImages(files);

  trackByImg = _trackByModel("missionImages")

  private openImageInput = (): void => this.imageInput.nativeElement.click();

  private deleteSelectedImages = () => {
    this.deleteImages({ids: this.selectableContainer.getSelectedIds()});     
    this.selectableContainer.resetSelections();
  }

  private deleteImages = (payload: {ids?: string[], id?: string}) => 
    this.facade.deleteChildren("missionImages", payload);

  private  openConfirmDeleteDialog = () => {   
    this.confirmService.dialog$.subscribe(x => 
      x.open(_confirmDeleteDialogFactory("utvalgte bilder", this.deleteSelectedImages))
    )
  }
  
  private openMailImageSheet = (ids: string[]) => {    
    const email = this.facade.getEmployerEmail()
    this.formService.open<EmailForm, null>({
      formConfig: {...EmailForm, options: { allowPristine: email != null } }, 
      navConfig: {title: "Send bilder"},
    }, 
    { initialValue: { email } },
    (val) => { 
      this.facade.mailChildren("missionImages", val.email, ids);
      this.selectableContainer.resetSelections();
    })
  }

  private downloadImages = (imgs: ImmutableArray<MissionImage>) => 
    this.downloaderService.downloadUrls(imgs.map(x => x.fileName ? _appFileUrl(x.fileName, FileFolder.MissionImageOriginal) : null));
  
}
