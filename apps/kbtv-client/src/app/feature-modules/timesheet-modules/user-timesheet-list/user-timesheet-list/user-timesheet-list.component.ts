import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UserTimesheet } from "@core/models";
import { AppDialogService } from "@core/services/app-dialog.service";
import { ModelState } from "@core/state/model-state.interface";
import { AppButton } from "@shared-app/interfaces/app-button.interface";
import { AppChip } from '@shared-app/interfaces/app-chip.interface';
import { UserTimesheetCardDialogWrapperComponent } from "@shared-timesheet/components/user-timesheet-card-dialog-wrapper.component";
import { TimesheetFormState, UserTimesheetForm, UserTimesheetModelForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { _timesheetCriteriaChipsFactory } from "@shared-timesheet/helpers/timesheet-criteria-chips-factory.helper";
import { UserTimesheetCriteriaFormService } from "@shared-timesheet/timesheet-criteria-form-service";
import { BottomIconButtons } from "@shared/constants/bottom-icon-buttons.const";
import { Immutable } from '@fretve/global-types';
import { ModelFormService } from 'model/form';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { UserTimesheetListProviders } from "./state/user-timesheet-list.providers";
import { UserTimesheetListFacade } from './user-timesheet-list.facade';

@Component({
  selector: "app-user-timesheet-list",
  templateUrl: "./user-timesheet-list.component.html",
  providers: UserTimesheetListProviders,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTimesheetListComponent {

  criteriaChips$: Observable<AppChip[]> = this.facade.criteria$.pipe(
    map(criteria =>  _timesheetCriteriaChipsFactory(criteria, (x) => this.facade.updateCriteria(x)))
  )

  timesheets$ = this.facade.timesheets$;

  bottomActions: AppButton[];

  actionFab: AppButton = { 
    icon: "add", aria: 'Legg til', 
    callback: () => this.openTimesheetForm(<Immutable<Partial<UserTimesheet>>> this.facade.criteria) 
  }

  constructor(
    private facade: UserTimesheetListFacade,
    private criteriaFormService: UserTimesheetCriteriaFormService,
    private dialogService: AppDialogService,
    private modelFormService: ModelFormService<ModelState>
  ) {
    this.bottomActions = [
      { ...BottomIconButtons.Filter,
        callback: this.openTimesheetFilter }
    ]
  }
  openTimesheetForm = (initialValue?: Immutable<Partial<UserTimesheet>>): void => {
    this.modelFormService.open<UserTimesheet, UserTimesheetForm, TimesheetFormState>(
      UserTimesheetModelForm,
      initialValue,
    )
  };

  openTimesheetFilter = (): void => {
    this.criteriaFormService.open((val) => this.facade.updateCriteria(val), this.facade.criteria)
  }

  openTimesheetCard = (timesheetId: string) =>
    this.dialogService.dialog$.subscribe(x => x.open(UserTimesheetCardDialogWrapperComponent, {
      data: timesheetId, panelClass: 'extended-dialog'}));

}
