import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { _getISO } from 'date-time-helpers';

@Component({
  selector: 'app-timesheet-day-label',
  templateUrl: './timesheet-day-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetDayLabelComponent {

  @Input() date: Date;
  @Output() labelClicked = new EventEmitter<string>();

  constructor() {}

  onLabelClick(){
    this.labelClicked.emit(_getISO(this.date))
  }

}
