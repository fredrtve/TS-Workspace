import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelFile } from '@core/models';
import { AppConfirmDialogService } from '@core/services/app-confirm-dialog.service';
import { DownloaderService } from '@core/services/downloader.service';
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { ImageViewerDialogWrapperConfig } from './image-viewer-dialog-wrapper-config.interface';

export const DialogClosedByUserEvent = "DIALOG_CLOSED_BY_USER";

@Component({
  selector: 'app-image-viewer-dialog-wrapper',
  template: `
  <app-image-viewer
    [images]="cfg.images" 
    [currentImage]="cfg.currentImage"
    [navConfig]="navConfig"
    [folder]="cfg.fileFolder"
    (currentImageChanged)="currentImage = $event"
    (closed)="close()">
  </app-image-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ImageViewerDialogWrapperComponent {

  navConfig: MainTopNavConfig;
  
  currentImage: ModelFile;

  constructor( 
    private confirmService: AppConfirmDialogService,
    private downloaderService: DownloaderService,
    private dialogRef: MatDialogRef<ImageViewerDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public cfg: ImageViewerDialogWrapperConfig
    ) {
      this.currentImage = cfg.currentImage;
      this.navConfig = {
        buttons: [{text: "Last ned bilde", icon: "cloud_download", callback: this.downloadImage}],
        customCancelFn: this.close
      }

      if(cfg.deleteAction) 
        this.navConfig.buttons?.push({
          text: "Slett bilde", icon: "delete", 
          callback: this.openConfirmDeleteDialog, 
          allowedRoles: this.cfg.deleteAction?.allowedRoles
        })
    }

    close = () => this.dialogRef.close(DialogClosedByUserEvent);
    
    private deleteCurrentImage(): void{
      this.dialogRef.close();
      this.cfg.deleteAction?.callback(<string> this.currentImage.id)
    }
    
    private downloadImage = () => 
      this.currentImage?.fileName ? 
      this.downloaderService.downloadUrl(
        _appFileUrl(this.currentImage.fileName, this.cfg.downloadFolder || this.cfg.fileFolder)
      ) : null
    
    private openConfirmDeleteDialog = () => {  
      this.confirmService.dialog$.subscribe(x => x.open({
        title: 'Slett bilde?', 
        confirmText: 'Slett',
        confirmCallback: () => this.deleteCurrentImage()
      }));
    }
  
}
