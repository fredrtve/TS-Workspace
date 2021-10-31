import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Timesheet } from "@core/models";
import { AppDialogService } from "@core/services/app-dialog.service";
import { DeviceInfoService } from '@core/services/device-info.service';
import { ModelState } from "@core/state/model-state.interface";
import { AppButton } from "@shared-app/interfaces/app-button.interface";
import { UserTimesheetCardDialogWrapperComponent } from "@shared-timesheet/components/user-timesheet-card-dialog-wrapper.component";
import { UserTimesheetModelForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { WeekCriteriaForm, WeekCriteriaFormState } from "@shared-timesheet/forms/week-criteria-controls.const";
import { WeekCriteria } from '@shared-timesheet/interfaces';
import { BottomIconButtons } from "@shared/constants/bottom-icon-buttons.const";
import { _getDateOfWeek, _getWeekRange } from 'date-time-helpers';
import { FormService } from "form-sheet";
import { Maybe } from "global-types";
import { ModelFormService } from 'model/form';
import { combineLatest, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { UserTimesheetListCriteriaQueryParam } from "../../user-timesheet-list/user-timesheet-list/user-timesheet-list-route-params.const";
import { UserTimesheetWeekCriteriaFormSheet } from "./user-timesheet-week-criteria-form-sheet.const";
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

  titles$ = this.facade.weekCriteria$.pipe(map(x => this.getTitles(x)));

  vm$: Observable<ViewModel> = combineLatest([
    this.facade.weekDaySummaries$,
    this.deviceInfoService.isXs$
  ]).pipe(
    map(([weekDaySummaries, isXs]) => { return { 
      numberOfWeekDays: isXs ? 5 : 7, 
      weekDaySummaries, weekCriteria: this.facade.weekCriteria
    }}),
  );

  bottomActions: AppButton[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: AppDialogService,
    private deviceInfoService: DeviceInfoService,
    private facade: UserTimesheetWeekFacade,
    private modelFormService: ModelFormService<ModelState>,
    private formService: FormService,
  ) {
    this.bottomActions = [  
      {...BottomIconButtons.Filter, callback: this.openWeekFilter},
      {icon: "list", text: "Timeliste", aria: "Timeliste", callback: this.goToTimesheetList},
    ]
  }

  nextWeek = (): void => this.facade.nextWeek()

  previousWeek = (): void => this.facade.previousWeek()

  openTimesheetForm = (initialValue?: Partial<Timesheet>): void => {
    this.modelFormService.open(
      UserTimesheetModelForm,
      initialValue,
    )
  };

  openTimesheetCard = (timesheetId: string) =>
    this.dialogService.dialog$.subscribe(x => x.open(UserTimesheetCardDialogWrapperComponent, {
      data: timesheetId, panelClass: 'extended-dialog'}));

  private goToTimesheetList = () => {
      const {weekNr, year} = this.facade.weekCriteria || {};
      this.router.navigate(["liste", { 
        [UserTimesheetListCriteriaQueryParam]: (weekNr && year) ? JSON.stringify({
            dateRange:  _getWeekRange(_getDateOfWeek(weekNr, year))
        }) : null
      }], {relativeTo: this.route});
  };

  private openWeekFilter = (): void => { 
    this.formService.open<WeekCriteriaForm, WeekCriteriaFormState>(
      UserTimesheetWeekCriteriaFormSheet,
      { initialValue: {...this.facade.weekCriteria, weekNr: this.facade.weekCriteria.weekDay?.toString() } },
      (val) => this.facade.updateCriteria({...val, weekNr: parseInt(val.weekNr) }) 
    );
  }

  private getTitles(weekCriteria: Maybe<Partial<WeekCriteria>>): {title: string, subTitle: string} {
    return { 
      title:  "Uke " + weekCriteria?.weekNr || "",
      subTitle: weekCriteria?.year?.toString() || "",
    }
  }
}
