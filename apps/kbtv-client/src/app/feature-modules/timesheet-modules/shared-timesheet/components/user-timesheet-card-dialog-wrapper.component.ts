import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { _find } from '@fretve/array-helpers';
import { Timesheet } from '@core/models';
import { Immutable, Maybe } from '@fretve/global-types';
import { Store } from 'state-management'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreState } from '../../user-timesheet-week/store-state.interface';
import { modelCtx } from '@core/configurations/model/app-model-context';

const includeQuery = modelCtx.get("userTimesheets")
  .include("missionActivity", x => x.include("mission").include("activity"));

@Component({
  selector: 'app-user-timesheet-card-dialog-wrapper',
  template: `
  <app-timesheet-card data-cy="timesheet-card-dialog"
    [timesheet]="timesheet$ | async">
  </app-timesheet-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTimesheetCardDialogWrapperComponent {

  timesheet$: Observable<Maybe<Immutable<Timesheet>>> = 
    this.store.select$(["userTimesheets", "missionActivities", "activities", "missions"]).pipe(
      map(state => includeQuery.where(x => x.id === this.timesheetId).first(state))
    )

  constructor(
    private store: Store<StoreState>,
    @Inject(MAT_DIALOG_DATA) public timesheetId: string
  ) {}
  
}
