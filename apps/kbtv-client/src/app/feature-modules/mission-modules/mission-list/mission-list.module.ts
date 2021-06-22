import { NgModule } from '@angular/core';
import { GenericActionRequestMap } from '@core/configurations/optimistic/generic-action-request-map.const';
import { StateMissionCriteria } from '@shared-mission/interfaces';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { SetMissionCriteriaReducer } from '@shared-mission/state/reducers.const';
import { ModelFormModule } from 'model/form';
import { DeleteModelAction, ModelStateCommandsModule, SetSaveModelStateAction } from 'model/state-commands';
import { OptimisticHttpModule } from 'optimistic-http';
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
    OptimisticHttpModule.forFeature({
      [SetSaveModelStateAction]: GenericActionRequestMap[SetSaveModelStateAction],  
      [DeleteModelAction]: GenericActionRequestMap[DeleteModelAction],   
    }),   
  ],
  providers: []
})
export class MissionListModule {}
