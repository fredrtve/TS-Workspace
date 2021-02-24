import { NgModule } from '@angular/core';
import { AppSaveModelProviders } from '@core/state/providers.const';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { FetchModelProviders } from 'state-model';
import { SharedTimesheetModule } from '../shared-timesheet/shared-timesheet.module';
import { FetchTimesheetProviders } from '../shared-timesheet/state/providers.const';
import { AdminTimesheetCardDialogWrapperComponent } from './components/admin-timesheet-card-dialog-wrapper.component';
import { SwipeCardComponent } from './components/swipe-card/swipe-card.component';
import { TimesheetAdminListViewComponent } from './timesheet-admin-list/timesheet-admin-list-view/timesheet-admin-list-view.component';
import { TimesheetAdminListComponent } from './timesheet-admin-list/timesheet-admin-list.component';
import { TimesheetAdminRoutingModule } from './timesheet-admin-routing.module';
import { TimesheetAdminUserListComponent } from './timesheet-admin-user-list/timesheet-admin-user-list.component';
import { TimesheetAdminWeekListViewComponent } from './timesheet-admin-week-list/timesheet-admin-week-list-view/timesheet-admin-week-list-view.component';
import { TimesheetAdminWeekListComponent } from './timesheet-admin-week-list/timesheet-admin-week-list.component';
import { UpdateTimesheetStatusesHttpEffect } from './update-timesheet-statuses/update-timesheet-statuses.http.effect';
import { UpdateTimesheetStatusesReducer } from './update-timesheet-statuses/update-timesheet-statuses.reducer';

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
    { provide: STORE_EFFECTS, useClass: UpdateTimesheetStatusesHttpEffect, multi: true},
    { provide: STORE_REDUCERS, useValue: UpdateTimesheetStatusesReducer, multi: true},
    FetchModelProviders,
    ...AppSaveModelProviders,
    ...FetchTimesheetProviders,
  ],
  imports: [
    SharedTimesheetModule,
    TimesheetAdminRoutingModule
  ]
})
export class TimesheetAdminModule {}
