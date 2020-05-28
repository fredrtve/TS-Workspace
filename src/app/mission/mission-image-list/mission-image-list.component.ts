import { Component, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { MailImageSheetComponent } from "../components/mail-image-sheet.component";
import { filter, map, takeUntil, tap, distinctUntilChanged } from "rxjs/operators";
import { RolePresets } from 'src/app/shared/enums';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { MissionImage, Mission } from 'src/app/shared/models';
import { MissionImageService, MainNavService, NotificationService, MissionService, DeviceInfoService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AppButton, AppFile } from 'src/app/shared/interfaces';
import { SubscriptionComponent } from 'src/app/shared/components/abstracts/subscription.component';
import { ConfirmDialogComponent } from 'src/app/shared/components';
import { ImageViewerDialogWrapperComponent } from '../components/image-viewer/image-viewer-dialog-wrapper.component';
import { SelectableListBase } from '../components/selectable-list/selectable-list.base';

@Component({
  selector: "app-mission-image-list",
  templateUrl: "./mission-image-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MissionImageListComponent extends SubscriptionComponent{
  @ViewChild('imageList', {static: false}) imageList: SelectableListBase<AppFile>;

  RolePresets = RolePresets;

  private mission: Mission;

  currentSelections: number[] = [];

  images$: Observable<MissionImage[]>;
  isXs$: Observable<boolean> = this.deviceInfoService.isXs$;
  
  constructor(
    private deviceInfoService: DeviceInfoService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private mainNavService: MainNavService,
    private missionImageService: MissionImageService,
    private missionService: MissionService,
    private route: ActivatedRoute,
    private router: Router) {
      super();
      this.configureMainNav(this.missionId)
    }

  get missionId() {
    return +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.images$ = this.missionImageService.getByMissionId$(this.missionId).pipe(tap(this.updateMainNav));

    this.missionService.getDetails$(this.missionId)
      .pipe(takeUntil(this.unsubscribe)).subscribe(x => this.mission = x)
  }

  uploadImages = (files: FileList) => {
    this.missionImageService.addImages$(this.missionId, files).subscribe(data =>
      this.notificationService.setNotification(
        `Vellykket! ${data.length} ${data.length > 1 ? 'bilder' : 'bilde'} lastet opp.`
        )
    );
  }

  deleteImages = (ids: number[]) => {
    this.missionImageService.deleteRange$(ids).subscribe(data =>
      this.notificationService.setNotification(
        `Vellykket! ${ids.length} ${ids.length > 1 ? 'bilder' : 'bilde'} slettet.`
        )
    );
  }

  openConfirmDeleteDialog = (ids: number[]) => {
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Bekreft at du ønsker å slette utvalgte bilder.'});
    deleteDialogRef.afterClosed().pipe(filter(res => res)).subscribe(res => this.deleteImages(ids));
  }
  
  openMailImageSheet = (ids: number[]) => {
    let botRef = this.bottomSheet.open(MailImageSheetComponent, {
      data: { toEmailPreset: this.mission.employer.email, ids: ids },
    });
    botRef
      .afterDismissed()
      .pipe(filter((isSent) => isSent))
      .subscribe((x) => this.imageList.clearSelections());
  }

  openImageViewer(image: AppFile, images: AppFile[]) {
    this.dialog.open(ImageViewerDialogWrapperComponent, {
      width: "100%",
      height: "100%",
      panelClass: "image_viewer_dialog",
      data: {currentImage: image, images},
    });
  }

  private configureMainNav(missionId: number){
    let cfg = this.mainNavService.getDefaultConfig();
    cfg.backFn = this.onBack;  
    cfg.backFnParams = [missionId];
    cfg.title = 'Bilder';
    this.mainNavService.addConfig(cfg);
  }

  private updateMainNav = (images: MissionImage[]) => {
    let cfg = this.mainNavService.getCurrentConfig(); 
    cfg.bottomSheetButtons = this.getBottomSheetButtons(images.map(x => x.id));
    this.mainNavService.addConfig(cfg);
  }

  private onBack = (missionId: number) => this.router.navigate(['/oppdrag', missionId, 'detaljer']);

  private getBottomSheetButtons = (ids: number[]): AppButton[] => 
    [{icon:'send', text:'Send alle bilder', callback: this.openMailImageSheet, params: [ids]}]

}
