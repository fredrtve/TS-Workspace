import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Timesheet } from '@core/models';
import { Maybe } from '@fretve/global-types';
import { TimesheetSummary } from '@shared-timesheet/interfaces';

@Component({
  selector: 'app-timesheet-admin-week-list-view',
  templateUrl: './timesheet-admin-week-list-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetAdminWeekListViewComponent {

  @Input() summaries: TimesheetSummary[];
  @Input() isXs: boolean;

  @Output() timesheetsConfirmed = new EventEmitter<Timesheet[]>();
  @Output() weekSelected = new EventEmitter<number>();

  constructor() { }

  trackByWeek = (index:number, summary: TimesheetSummary): Maybe<number> => summary.weekNr;

  changeTimesheetStatuses = (timesheets: Timesheet[]): void => 
    this.timesheetsConfirmed.emit(timesheets)

  selectWeek = (weekNr: number) => this.weekSelected.emit(weekNr);
  
}
