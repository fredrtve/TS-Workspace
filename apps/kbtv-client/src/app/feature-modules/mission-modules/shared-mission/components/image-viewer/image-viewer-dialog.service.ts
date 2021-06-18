import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppDialogService } from "@core/services/app-dialog.service";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { ImageViewerDialogWrapperConfig } from "./image-viewer-dialog-wrapper-config.interface";
import { DialogClosedByUserEvent, ImageViewerDialogWrapperComponent } from "./image-viewer-dialog-wrapper.component";

@Injectable({providedIn: "root"})
export class ImageViewerDialogService {

    constructor(
        private dialogService: AppDialogService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ){}

    open(config: ImageViewerDialogWrapperConfig): void { 
        this.appendDialogQuery()
        
        this.dialogService.dialog$.pipe(
            map(dialog => dialog.open(ImageViewerDialogWrapperComponent, {
                width: "100%",
                height: "100%",
                panelClass: "image_viewer_dialog",
                data: config
            })), 
            switchMap(ref => ref.afterClosed()),
            filter(x => x === DialogClosedByUserEvent),
            tap(x => this.location.back())
        ).subscribe();
    }

    private appendDialogQuery(): void {
        this.router.navigate([], { 
            relativeTo: this.route, 
            queryParams: {dialog: true}, 
            queryParamsHandling: 'merge' 
        });
    }
}