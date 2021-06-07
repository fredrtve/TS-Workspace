import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { Mission } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ButtonTypes } from '@shared-app/enums/button-types.enum';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { FileFolder } from '@shared-app/enums/file-folder.enum';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { ImageViewerDialogService } from '@shared-mission/components/image-viewer/image-viewer-dialog.service';
import { EditMissionModelForm } from '@shared-mission/forms/save-mission-model-form.const';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { BottomIconButtons } from '@shared/constants/bottom-icon-buttons.const';
import { Immutable, Maybe } from 'global-types';
import { ModelFormService } from 'model/form';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserTimesheetListCriteriaQueryParam } from 'src/app/feature-modules/timesheet-modules/user-timesheet-list/user-timesheet-list/user-timesheet-list-route-params.const';
import { SelectedMissionIdParam } from '../mission-list-route-params.const';
import { MissionListFacade } from '../mission-list.facade';

interface ViewModel { mission: Maybe<Immutable<Mission>>, bottomActions: AppButton[], navConfig: MainTopNavConfig }

@Component({
  selector: 'app-mission-details',
  templateUrl: './mission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDetailsComponent extends WithUnsubscribe() {
  @ViewChild('headerImageInput') headerImageInput: ElementRef<HTMLElement>;
  @ViewChild('missionImageInput') missionImageInput: ElementRef<HTMLElement>;

  FileFolder = FileFolder;

  baseHeaderImgButton: Partial<AppButton> = {type: ButtonTypes.Stroked}

  private can = RolePermissions.MissionList;

  get missionId() { return this.route.snapshot.paramMap.get(SelectedMissionIdParam) }

  vm$: Observable<ViewModel> =  this.route.paramMap.pipe(
    switchMap(x =>  this.facade.getMissionDetails$(x.get(SelectedMissionIdParam))),
    map(mission => { return { 
      bottomActions: this.getBottomActions(mission), 
      navConfig: { title: mission?.address, backFn: this.onBack },
      mission
    }})
  );

  addHeaderImgBtn: AppButton = {
    text: "Legg til forsidebilde", 
    icon: "add_photo_alternate", 
    callback: () => this.openImageInput(this.headerImageInput), 
    allowedRoles: this.can.update
  };

  actionFab: AppButton = {
    icon: "camera_enhance", 
    callback: () => this.openImageInput(this.missionImageInput)
  }

  constructor(
    private facade: MissionListFacade,
    private route: ActivatedRoute,
    private router: Router,
    private imageViewer: ImageViewerDialogService,
    private modelFormService: ModelFormService<ModelState>
  ) { super() }

  updateHeaderImage = (files: FileList): void => 
    (files?.length && this.missionId) ? this.facade.updateHeaderImage(this.missionId, files[0]) : undefined;

  addMissionImages = (files: FileList): void => 
    (files?.length && this.missionId) ? this.facade.addMissionImages(this.missionId, files) : undefined;

  openImageViewer(mission: Mission) {
    this.imageViewer.open({currentImage: mission, fileFolder: FileFolder.MissionHeader})
  }
 
  private openImageInput = (ref: ElementRef<HTMLElement>): void => ref?.nativeElement?.click();

  private openMissionForm = (entityId: Maybe<string>) => 
    this.modelFormService.open(EditMissionModelForm, {id: <string> entityId}, {onDeleteUri: "/oppdrag"})

  private goToTimesheets = (mission: Maybe<Immutable<Mission>>) => 
    this.router.navigate(['timer', {
      returnUrl: this.router.url, 
      [UserTimesheetListCriteriaQueryParam]: JSON.stringify({mission, dateRangePreset: DateRangePresets.ShowAll})
    }], {relativeTo: this.route});

  private getBottomActions(mission: Maybe<Immutable<Mission>>): AppButton[] {
    return  [
      {icon: "timer", text: "Timer", callback: () => this.goToTimesheets(mission), allowedRoles: RolePermissions.UserTimesheetList.access},
      // {icon: "more_vert", callback: this.openBottomSheetMenu, params: [mission], allowedRoles: this.can.update},
      {...BottomIconButtons.Edit, callback: () => this.openMissionForm(mission?.id), allowedRoles: this.can.update},
      {...this.addHeaderImgBtn, text: 'Nytt forsidebilde'}
    ]
  }

  private onBack = () => this.router.navigate(['../../'], {relativeTo: this.route})

}
