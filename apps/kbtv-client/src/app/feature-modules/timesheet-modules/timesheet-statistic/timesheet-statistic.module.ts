import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormsModule } from '@fretve/dynamic-forms';
import { ModelStateFetcherModule } from 'model/state-fetcher';
import { OptimisticHttpModule } from 'optimistic-http';
import { AppAgGridModule } from 'src/app/app-ag-grid/app-ag-grid.module';
import { StateManagementModule } from 'state-management';
import { SharedTimesheetModule } from '../shared-timesheet/shared-timesheet.module';
import { FetchTimesheetProviders } from '../shared-timesheet/state/providers.const';
import { DefaultState } from './state/default-state.const';
import { FetchTimesheetsEffect } from './state/effects';
import { TimesheetStatisticReducers } from './state/reducers.const';
import { TimesheetStatisticRoutingModule } from './timesheet-statistic-routing.module';
import { TimesheetStatisticTableComponent } from './timesheet-statistic/timesheet-statistic-table/timesheet-statistic-table.component';
import { TimesheetStatisticComponent } from './timesheet-statistic/timesheet-statistic.component';

const OptimisticFeatureProps = ["timesheetStatisticTimesheetCriteria", "timesheetStatisticGroupBy"]

@NgModule({
  declarations: [
    TimesheetStatisticComponent,
    TimesheetStatisticTableComponent
  ],
  providers:[
    DatePipe,
    ...FetchTimesheetProviders,
  ],
  imports: [
    SharedTimesheetModule,
    TimesheetStatisticRoutingModule,
    AppAgGridModule,
    DynamicFormsModule,
    StateManagementModule.forFeature({
      reducers: TimesheetStatisticReducers, 
      effects: [FetchTimesheetsEffect],
      defaultState: DefaultState
    }), 
    ModelStateFetcherModule,
    OptimisticHttpModule.forFeature(undefined, OptimisticFeatureProps),
  ],
})
export class TimesheetStatisticModule {}
