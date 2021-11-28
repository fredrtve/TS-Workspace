import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timesheet } from '@core/models';
import { Immutable } from '@fretve/global-types';

@Component({
  selector: 'app-admin-timesheet-card-dialog-wrapper',
  template: `
    <app-timesheet-card 
        [timesheet]="timesheet">
    </app-timesheet-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminTimesheetCardDialogWrapperComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public timesheet: Immutable<Timesheet>) { }
}
