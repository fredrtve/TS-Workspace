import { NgModule } from '@angular/core';
import { _deleteModelRequest, _setSaveModelRequest } from '@core/configurations/optimistic/global-action-requests';
import { ModelFormModule } from 'model/form';
import { ModelStateCommandsModule } from 'model/state-commands';
import { OptimisticHttpModule, _createActionRequestMap } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { SharedTimesheetModule } from '../shared-timesheet/shared-timesheet.module';
import { UserTimesheetListRoutingModule } from './user-timesheet-list-routing.module';
import { UserTimesheetListViewComponent } from './user-timesheet-list/user-timesheet-list-view/user-timesheet-list-view.component';
import { UserTimesheetListComponent } from './user-timesheet-list/user-timesheet-list.component';

@NgModule({
  declarations: [
    UserTimesheetListComponent,
    UserTimesheetListViewComponent,
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
    UserTimesheetListRoutingModule,
  ],
  providers:[ ],
})
export class UserTimesheetListModule {
  constructor(){}
}
