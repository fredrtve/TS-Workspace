import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RolePermissions } from "@core/configurations/role-permissions.const";
import { MissionImage, ModelFile } from '@core/models';
import { AppConfirmDialogService } from "@core/services/app-confirm-dialog.service";
import { DeviceInfoService } from '@core/services/device-info.service';
import { DownloaderService } from '@core/services/downloader.service';
import { FileFolder } from "@shared-app/enums/file-folder.enum";
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { _confirmDeleteDialogFactory } from "@shared-app/helpers/confirm-delete-dialog.factory";
import { _trackByModel } from "@shared-app/helpers/trackby/track-by-model.helper";
import { AppButton } from "@shared-app/interfaces/app-button.interface";
import { BaseSelectableContainerComponent } from "@shared-mission/components/base-selectable-container.component";
import { ImageViewerDialogService } from "@shared-mission/components/image-viewer/image-viewer-dialog.service";
import { EmailForm } from '@shared-mission/forms/email-form.const';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { FormService } from "form-sheet";
import { ImmutableArray, Maybe } from 'global-types';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { SelectedMissionIdParam } from "../../mission-list/mission-list-route-params.const";
import { MissionImageListFacade } from '../mission-image-list.facade';

interface ViewModel { 
  images: Maybe<ImmutableArray<MissionImage>>, 
  columns: 2 | 4,  
  selectionsTitle: string
}

@Component({
  selector: "app-mission-image-list",
  templateUrl: "./mission-image-list.component.html",
  styleUrls: ["./mission-image-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionImageListComponent extends BaseSelectableContainerComponent{
  @ViewChild('imageInput') imageInput: ElementRef<HTMLElement>;
  FileFolder = FileFolder;
  private can = RolePermissions.MissionImageList;

  get missionId(): Maybe<string> { 
    return this.route.parent?.parent?.snapshot.paramMap.get(SelectedMissionIdParam)  
  }
  
  vm$: Observable<ViewModel> = combineLatest([
    this.facade.getMissionImages$(this.missionId),
    this.deviceInfoService.isXs$,
    this.currentSelections$
  ]).pipe(
    tap(x => this.images = x[0] || []),
    map(([images, isXs, selections]) => { return <ViewModel> { 
      images, 
      selectionsTitle: selections.length === 0 ? null :
        `${selections.length} bilde${selections.length === 1 ? '' : 'r'} valgt`,
      columns: isXs ? 2 : 4
    }})
  )

  actionFab: AppButton;

  bottomActions: AppButton[];

  selectionBarConfig: MainTopNavConfig;

  private images: ImmutableArray<MissionImage>;

  constructor( 
    private downloaderService: DownloaderService,
    private deviceInfoService: DeviceInfoService,
    private formService: FormService,
    private confirmService: AppConfirmDialogService,
    private imageViewer: ImageViewerDialogService,
    private facade: MissionImageListFacade,
    private route: ActivatedRoute) {
      super();

      this.actionFab = 
        {icon: "camera_enhance", aria: 'Ta bilde', callback: this.openImageInput, allowedRoles: this.can.create};

      this.selectionBarConfig = {
        customCancelFn: () => this.resetSelections(),
        buttons: [
          {icon: "send", aria: 'Send', callback: () => this.openMailImageSheet(this.currentSelections), allowedRoles: this.can.sendEmail}, 
          {icon: "delete_forever", aria: 'Slett', color: 'warn', callback: this.openConfirmDeleteDialog, allowedRoles: this.can.delete}
        ]
      }

      this.bottomActions = [
        {icon: 'send', text: 'Send', callback: () => this.openMailImageSheet(<string[]> this.images?.map(x => x.id)), allowedRoles: this.can.sendEmail},
        {icon: "cloud_download", text: "Last ned", callback: () => this.downloadImages(this.images)},
      ]
    }

  openImageViewer(currentImage: ModelFile, images: ModelFile[]) {
    this.imageViewer.open({
      currentImage, images, fileFolder: FileFolder.MissionImage, downloadFolder: FileFolder.MissionImageOriginal,
      deleteAction: { 
        callback: (id: string) => this.deleteImages({id}),
        allowedRoles: RolePermissions.MissionImageList.delete
      }
    })
  }

  uploadImages = (files: FileList): void => 
    this.missionId ? this.facade.add(this.missionId, files) : undefined;

  trackByImg = _trackByModel("missionImages")

  private openImageInput = (): void => this.imageInput.nativeElement.click();

  private deleteSelectedImages = () => {
    this.deleteImages({ids: this.currentSelections});     
    this.resetSelections();
  }

  private deleteImages = (payload: {ids?: string[], id?: string}) => 
    this.facade.delete(payload);

  private  openConfirmDeleteDialog = () => {   
    this.confirmService.dialog$.subscribe(x => 
      x.open(_confirmDeleteDialogFactory("utvalgte bilder", this.deleteSelectedImages))
    )
  }
  
  private openMailImageSheet = (ids: string[]) => {    
    const email = this.facade.getMissionEmployerEmail(this.missionId)
    this.formService.open<EmailForm, null>({
      formConfig: {...EmailForm, options: { allowPristine: email != null } }, 
      navConfig: {title: "Send bilder"},
    }, 
    { initialValue: { email } },
    (val) => { 
      this.facade.mailImages(val.email, ids);
      this.selectableContainer.resetSelections();
    })
  }

  private downloadImages = (imgs: ImmutableArray<MissionImage>) => 
    this.downloaderService.downloadUrls(imgs.map(x => x.fileName ? _appFileUrl(x.fileName, FileFolder.MissionImageOriginal) : null));
  
}
