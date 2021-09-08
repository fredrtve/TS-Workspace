import { NgModule } from '@angular/core';
import { ModelFormModule } from 'model/form';
import { ModelStateCommandsModule } from 'model/state-commands';
import { ModelStateFetcherModule } from 'model/state-fetcher';
import { OptimisticHttpModule } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { SharedTimesheetModule } from '../shared-timesheet/shared-timesheet.module';
import { FetchTimesheetProviders } from '../shared-timesheet/state/providers.const';
import { AdminTimesheetCardDialogWrapperComponent } from './components/admin-timesheet-card-dialog-wrapper.component';
import { SwipeCardComponent } from './components/swipe-card/swipe-card.component';
import { FetchTimesheetsEffect, UpdateLeaderSettingsHttpEffect } from './state/effects.const';
import { TimesheetAdminReducers } from './state/reducers.const';
import { TimesheetAdminActionRequestMap } from './timesheet-admin-action-request-map.const';
import { TimesheetAdminListViewComponent } from './timesheet-admin-list/timesheet-admin-list-view/timesheet-admin-list-view.component';
import { TimesheetAdminListComponent } from './timesheet-admin-list/timesheet-admin-list.component';
import { TimesheetAdminRoutingModule } from './timesheet-admin-routing.module';
import { TimesheetAdminUserListComponent } from './timesheet-admin-user-list/timesheet-admin-user-list.component';
import { TimesheetAdminWeekListViewComponent } from './timesheet-admin-week-list/timesheet-admin-week-list-view/timesheet-admin-week-list-view.component';
import { TimesheetAdminWeekListComponent } from './timesheet-admin-week-list/timesheet-admin-week-list.component';

const OptimisticFeatureProps = ["timesheetAdminTimesheetCriteria","timesheetAdminWeekCriteria","timesheetAdminSelectedWeekNr"]

@NgModule({
  declarations: [
    TimesheetAdminListComponent,
    TimesheetAdminListViewComponent,
    TimesheetAdminUserListComponent,
    SwipeCardComponent,
    TimesheetAdminWeekListComponent,
    TimesheetAdminWeekListViewComponent,
    AdminTimesheetCardDialogWrapperComponent
  ],
  providers:[
    ...FetchTimesheetProviders,
  ],
  imports: [
    SharedTimesheetModule,
    TimesheetAdminRoutingModule,    
    StateManagementModule.forFeature({
      reducers: TimesheetAdminReducers, 
      effects: [FetchTimesheetsEffect, UpdateLeaderSettingsHttpEffect],
    }), 
    ModelStateCommandsModule,
    ModelStateFetcherModule, 
    ModelFormModule,
    OptimisticHttpModule.forFeature(TimesheetAdminActionRequestMap, OptimisticFeatureProps)
  ]
})
export class TimesheetAdminModule {}
