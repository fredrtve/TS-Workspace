import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timesheet } from '@core/models';
import { AppDialogService } from '@core/services/app-dialog.service';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { _trackByModel } from '@shared-app/helpers/trackby/track-by-model.helper';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { TimesheetForm } from '@shared-timesheet/forms/save-timesheet-model-forms.const';
import { BottomIconButtons } from '@shared/constants/bottom-icon-buttons.const';
import { FormService } from 'form-sheet';
import { Immutable, Maybe } from 'global-types';
import { combineLatest, Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { AdminTimesheetCardDialogWrapperComponent } from '../components/admin-timesheet-card-dialog-wrapper.component';
import { TimesheetAdminFacade } from '../timesheet-admin.facade';
import { TimesheetAdminListWeekNrQueryParam } from './timesheet-admin-list-route-params.const';
import { TimesheetAdminListWeekCriteriaFormSheet } from './timesheet-admin-list-week-criteria-form-sheet.const';

@Component({
  selector: 'app-timesheet-admin-list',
  templateUrl: './timesheet-admin-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetAdminListComponent extends WithUnsubscribe() {

  timesheets$ = this.facade.selectedWeekTimesheets$;

  titles$: Observable<{title: string, subTitle: string}> = combineLatest([  
    this.facade.weekCriteria$.pipe(
      map(({year, user}) => (year || "") + ' - ' + (user ? (user.firstName + ' ' + user.lastName) : ''))
    ),
    this.facade.selectedWeekNr$.pipe(
      tap(weekNr => !weekNr ? this.router.navigate(['/timeadministrering']) : null),
      map(weekNr => "Uke " + weekNr)
    ),
  ]).pipe(
    map(([subTitle, title]) => { return { title, subTitle } })
  )

  bottomActions: AppButton[];

  actionFab: AppButton = { 
    icon: "add", aria: 'Legg til', 
    callback: () => this.openTimesheetForm(undefined, {user: this.facade.weekCriteria.user}) 
  }

  constructor(
    private facade: TimesheetAdminFacade,
    private dialogService: AppDialogService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService) {
      super();
      this.bottomActions = [{...BottomIconButtons.Filter, callback: this.openWeekFilter}];
      
      this.route.paramMap.pipe(
        tap(x => this.facade.updateWeekNr(x.get(TimesheetAdminListWeekNrQueryParam))), 
        takeUntil(this.unsubscribe)
      ).subscribe();
    }

  toggleTimesheetStatus = (timesheet: Immutable<Timesheet>): void => 
    this.facade.updateStatuses([<string> timesheet.id],  
      timesheet.status === TimesheetStatus.Confirmed ? TimesheetStatus.Open : TimesheetStatus.Confirmed
    );

  openTimesheetForm = (entityId?: Maybe<string>, initialValue?: Immutable<Partial<TimesheetForm>>): void => 
    this.facade.openTimesheetForm(entityId, initialValue);
  
  openTimesheetCard = (timesheet: Immutable<Timesheet>) =>
    this.dialogService.dialog$.subscribe(x => x.open(AdminTimesheetCardDialogWrapperComponent, {
      data: timesheet, panelClass: 'extended-dialog'}));

  trackById = _trackByModel("timesheets");
  
  private openWeekFilter = () => 
    this.formService.open(TimesheetAdminListWeekCriteriaFormSheet, 
    { 
      initialValue: {...this.facade.weekCriteria, weekNr: <number>this.facade.selectedWeekNr},
      formState: this.facade.weekCriteriaFormState$
    },
    (val) => {
      if(val.weekNr) this.facade.updateWeekNr(val.weekNr)
      this.facade.updateCriteria(val)
    }
  );

}
