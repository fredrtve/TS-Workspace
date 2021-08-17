import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { _find } from 'array-helpers';
import { Timesheet } from '@core/models';
import { Immutable, Maybe } from 'global-types';
import { Store } from 'state-management'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreState } from '../../user-timesheet-week/store-state.interface';

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
    this.store.select$(["userTimesheets", "missions"]).pipe(map(state => {
        const timesheet = _find(state?.userTimesheets, this.timesheetId, "id");
        if(!timesheet) return;
        return {...timesheet, mission: _find(state?.missions, timesheet.missionId, "id")};
    }))

  constructor(
    private store: Store<StoreState>,
    @Inject(MAT_DIALOG_DATA) public timesheetId: string
  ) {}
  
}
