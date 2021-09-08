import { NgModule } from '@angular/core';
import { _deleteModelRequest, _setSaveModelRequest } from '@core/configurations/optimistic/global-action-requests';
import { ModelFormModule } from 'model/form';
import { ModelStateCommandsModule } from 'model/state-commands';
import { OptimisticHttpModule, _createActionRequestMap } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { SharedTimesheetModule } from '../shared-timesheet/shared-timesheet.module';
import { UserTimesheetWeekRoutingModule } from './user-timesheet-week-routing.module';
import { TimesheetDayLabelComponent } from './user-timesheet-week/timesheet-day-label/timesheet-day-label.component';
import { TimesheetMissionBarComponent } from './user-timesheet-week/timesheet-mission-bar/timesheet-mission-bar.component';
import { UserTimesheetWeekViewComponent } from './user-timesheet-week/user-timesheet-week-view/user-timesheet-week-view.component';
import { UserTimesheetWeekComponent } from './user-timesheet-week/user-timesheet-week.component';

@NgModule({
  declarations: [
    UserTimesheetWeekComponent,
    UserTimesheetWeekViewComponent,
    TimesheetDayLabelComponent,
    TimesheetMissionBarComponent,
  ],
  imports: [
    SharedTimesheetModule,
    StateManagementModule.forFeature({}), 
    ModelStateCommandsModule,
    ModelFormModule,
    OptimisticHttpModule.forFeature(_createActionRequestMap(
      _setSaveModelRequest,
      _deleteModelRequest,
    )),
    UserTimesheetWeekRoutingModule
  ] , 
  providers:[],
})
export class UserTimesheetWeekModule {
  constructor(){}
}
