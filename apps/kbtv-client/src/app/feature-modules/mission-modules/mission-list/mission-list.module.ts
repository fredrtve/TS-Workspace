import { NgModule } from '@angular/core';
import { _deleteModelRequest, _setSaveModelRequest } from '@core/configurations/optimistic/global-action-requests';
import { StateMissionCriteria } from '@shared-mission/interfaces';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { SetMissionCriteriaReducer } from '@shared-mission/state/reducers.const';
import { ModelFormModule } from 'model/form';
import { ModelStateCommandsModule } from 'model/state-commands';
import { OptimisticHttpModule, _createActionRequestMap } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { MissionListRoutingModule } from './mission-list-routing.module';
import { MissionListViewComponent } from './mission-list/mission-list-view/mission-list-view.component';
import { MissionListComponent } from './mission-list/mission-list.component';

const MissionListDefaultState: Partial<StateMissionCriteria> = {
  missionCriteria: {finished: false}
}

@NgModule({
  declarations: [
    MissionListComponent,
    MissionListViewComponent,
  ],
  imports: [
    SharedMissionModule,
    MissionListRoutingModule,    
    StateManagementModule.forFeature({
      reducers: [SetMissionCriteriaReducer], 
      defaultState: MissionListDefaultState
    }), 
    ModelStateCommandsModule,
    ModelFormModule,     
    OptimisticHttpModule.forFeature(_createActionRequestMap(
      _setSaveModelRequest,  
      _deleteModelRequest,
    )),   
  ],
  providers: []
})
export class MissionListModule {}
