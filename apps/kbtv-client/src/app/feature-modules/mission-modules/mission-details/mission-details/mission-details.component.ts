import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { Mission } from '@core/models';
import { Roles } from '@core/roles.enum';
import { ModelState } from '@core/state/model-state.interface';
import { ButtonTypes } from '@shared-app/enums/button-types.enum';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { FileFolder } from '@shared-app/enums/file-folder.enum';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { ImageViewerDialogService } from '@shared-mission/components/image-viewer/image-viewer-dialog.service';
import { EditMissionModelForm } from '@shared-mission/forms/save-mission-model-form.const';
import { BottomIconButtons } from '@shared/constants/bottom-icon-buttons.const';
import { MissionPositionPickerSheetService } from '@shared/scam/mission-position-picker/mission-position-picker-sheet.service';
import { Immutable, Maybe } from 'global-types';
import { ModelFormService } from 'model/form';
import { ModelCommand } from 'model/state-commands/public-api';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserTimesheetListCriteriaQueryParam } from 'src/app/feature-modules/timesheet-modules/user-timesheet-list/user-timesheet-list/user-timesheet-list-route-params.const';
import { MissionDetailsFacade } from '../mission-details.facade';

interface ViewModel { mission: Maybe<Immutable<Mission>>, bottomActions: AppButton[] }

@Component({
  selector: 'app-mission-details',
  templateUrl: './mission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MissionDetailsFacade]
})
export class MissionDetailsComponent extends WithUnsubscribe() {
  @ViewChild('headerImageInput') headerImageInput: ElementRef<HTMLElement>;
  @ViewChild('missionImageInput') missionImageInput: ElementRef<HTMLElement>;

  private can = RolePermissions.MissionList;

  FileFolder = FileFolder;
  Roles = Roles;
  
  baseHeaderImgButton: Partial<AppButton> = {type: ButtonTypes.Stroked}

  vm$: Observable<ViewModel> =  this.route.paramMap.pipe(
    switchMap(x => this.facade.getDetails$()),
    map(mission => { return { 
      bottomActions: this.getBottomActions(mission), 
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
    callback: () => this.openImageInput(this.missionImageInput),
  }

  constructor(
    private facade: MissionDetailsFacade,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private positionPickerService: MissionPositionPickerSheetService,
    private imageViewer: ImageViewerDialogService,
    private modelFormService: ModelFormService<ModelState>
  ) { super() }

  updateHeaderImage = (files: FileList): void => 
    files?.length ? this.facade.updateHeaderImage(files[0]) : undefined;

  addMissionImages = (files: FileList): void => 
    files?.length ? this.facade.addImages(files) : undefined;

  openImageViewer(mission: Mission) {
    this.imageViewer.open({currentImage: mission, fileFolder: FileFolder.MissionHeader})
  }

  private openMissionPositionPicker = () => 
    this.positionPickerService.open(this.facade.missionId);
 
  private openImageInput = (ref: ElementRef<HTMLElement>): void => ref?.nativeElement?.click();

  private openMissionForm = (id: string | undefined) => 
    this.modelFormService.open(EditMissionModelForm, {id})
      .afterDismissed().subscribe(x => x === ModelCommand.Delete ? this.location.back() : null)

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
      {...this.addHeaderImgBtn, text: 'Nytt forsidebilde'}, 
      { icon: "pin_drop", text: "Merk posisjon manuelt", callback: this.openMissionPositionPicker, allowedRoles: this.can.update },
    ]
  }

}
