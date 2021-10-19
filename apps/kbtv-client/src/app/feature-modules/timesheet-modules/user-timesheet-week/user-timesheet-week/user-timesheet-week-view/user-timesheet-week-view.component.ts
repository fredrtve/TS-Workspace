import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Timesheet } from '@core/models';
import { _trackByModel } from '@shared-app/helpers/trackby/track-by-model.helper';
import { ViewModel } from '../view-model.interface';

@Component({
  selector: "app-user-timesheet-week-view",
  templateUrl: "./user-timesheet-week-view.component.html",
  styleUrls: ["./user-timesheet-week-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTimesheetWeekViewComponent {

  @Input() vm: ViewModel;
  
  @Output() timesheetClicked = new EventEmitter<Timesheet>();
  @Output() labelClicked = new EventEmitter<string>();

  constructor() {}
    
  trackByTimesheet = _trackByModel("timesheets");

}
