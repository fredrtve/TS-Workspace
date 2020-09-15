import { NgModule } from '@angular/core';
import { TimesheetStatisticRoutingModule } from './timesheet-statistic-routing.module';

import { TimesheetStatisticComponent } from './timesheet-statistic/timesheet-statistic.component';
import { TimesheetStatisticTableComponent } from './timesheet-statistic/timesheet-statistic-table/timesheet-statistic-table.component';

import { AppAgGridModule } from 'src/app/app-ag-grid/app-ag-grid.module';
import { SharedTimesheetModule } from 'src/app/shared-timesheet/shared-timesheet.module';
import { DatePipe } from '@angular/common';
import { TimesheetStatisticStore } from './timesheet-statistic.store';


@NgModule({
  declarations: [
    TimesheetStatisticComponent,
    TimesheetStatisticTableComponent
  ],
  providers:[
    DatePipe,
    {provide: "FILTER_STORE", useExisting: TimesheetStatisticStore}
  ],
  imports: [
    SharedTimesheetModule,
    TimesheetStatisticRoutingModule,
    AppAgGridModule
  ],
})
export class TimesheetStatisticModule { }
