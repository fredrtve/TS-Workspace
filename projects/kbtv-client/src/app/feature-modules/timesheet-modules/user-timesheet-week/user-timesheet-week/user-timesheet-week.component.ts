import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceInfoService } from '@core/services/device-info.service';
import { ModelState } from "@core/state/model-state.interface";
import { AppButton } from "@shared-app/interfaces/app-button.interface";
import { UserTimesheetCardDialogWrapperComponent } from "@shared-timesheet/components/user-timesheet-card-dialog-wrapper.component";
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { WeekCriteriaForm } from '@shared/constants/forms/week-criteria-controls.const';
import { CreateUserTimesheetForm, EditUserTimesheetForm, TimesheetForm } from '@shared/constants/model-forms/save-user-timesheet-form.const';
import { _getDateOfWeek, _getWeekRange } from 'date-time-helpers';
import { DynamicForm, _disableControlsWithNoValue } from 'dynamic-forms';
import { FormService, OptionsFormState } from 'form-sheet';
import { Maybe } from "global-types";
import { ModelFormService } from 'model-form';
import { combineLatest, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { WeekCriteria } from '@shared-timesheet/interfaces';
import { UserTimesheetListCriteriaQueryParam } from "../../user-timesheet-list/user-timesheet-list/user-timesheet-list-route-params.const";
import { UserTimesheetWeekProviders } from './user-timesheet-week-providers.const';
import { UserTimesheetWeekFacade } from './user-timesheet-week.facade';
import { ViewModel } from './view-model.interface';

@Component({
  selector: "app-user-timesheet-week",
  templateUrl: "./user-timesheet-week.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: UserTimesheetWeekProviders
})
export class UserTimesheetWeekComponent {

  navConfig$: Observable<MainTopNavConfig> = 
    this.facade.weekCriteria$.pipe(map(x => this.getNavConfig(x)));

  vm$: Observable<ViewModel> = combineLatest([
    this.facade.weekDaySummaries$,
    this.deviceInfoService.isXs$
  ]).pipe(
    map(([weekDaySummaries, isXs]) => { return { isXs, weekDaySummaries, weekCriteria: this.facade.weekCriteria }}),
  );

  bottomActions: AppButton[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private deviceInfoService: DeviceInfoService,
    private facade: UserTimesheetWeekFacade,
    private modelFormService: ModelFormService,
    private formService: FormService,
  ) {
    this.bottomActions = [  
      {icon: "filter_list", callback: this.openWeekFilter},
      {icon: "list", callback: this.goToTimesheetList},
    ]
  }

  nextWeek = (): void => this.facade.nextWeek()

  previousWeek = (): void => this.facade.previousWeek()

  openTimesheetForm = (entityId?: Maybe<string>, form?: TimesheetForm): void => {
    let dynamicForm: DynamicForm<TimesheetForm,  OptionsFormState<Partial<ModelState>>>;
    if(!entityId) dynamicForm = {...CreateUserTimesheetForm, disabledControls: _disableControlsWithNoValue(form)}
    else dynamicForm = EditUserTimesheetForm

    this.modelFormService.open<ModelState, TimesheetForm>({
      formConfig: {
        dynamicForm: {...dynamicForm, initialValue: form}, entityId,
        stateProp: "userTimesheets",    
      }, 
    })
  };

  openTimesheetCard = (timesheetId: string) =>
    this.dialog.open(UserTimesheetCardDialogWrapperComponent, {
      data: timesheetId, panelClass: 'extended-dialog'});

  private goToTimesheetList = () => {
      const {weekNr, year} = this.facade.weekCriteria || {};
      this.router.navigate(["liste", { 
        [UserTimesheetListCriteriaQueryParam]: (weekNr && year) ? JSON.stringify({
            dateRange:  _getWeekRange(_getDateOfWeek(weekNr, year))
        }) : null
      }], {relativeTo: this.route});
  };

  private openWeekFilter = (): void => { 
    this.formService.open<WeekCriteria>({
      formConfig: {...WeekCriteriaForm, 
        disabledControls: {user: true}, 
        noRenderDisabledControls: true,  
        initialValue: this.facade.weekCriteria}, 
      navConfig: {title: "Velg filtre"},
      submitCallback: (val: WeekCriteria) => this.facade.updateCriteria(val)
    });
  }

  private getNavConfig(weekCriteria: Maybe<WeekCriteria>): MainTopNavConfig{
    return { 
      title:  "Uke " + weekCriteria?.weekNr || "",
      subTitle: weekCriteria?.year?.toString() || "",
    }
  }
}
