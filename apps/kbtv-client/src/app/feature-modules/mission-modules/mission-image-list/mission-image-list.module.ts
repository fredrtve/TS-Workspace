import { SetSaveModelFileStateAction } from '@core/global-actions';
import { NgModule } from '@angular/core';
import { GenericActionRequestMap } from '@core/configurations/optimistic/generic-action-request-map.const';
import { MailModelsHttpEffect } from '@core/state/mail-models/mail-models.http.effect';
import { SaveModelFileEffect } from '@core/state/save-model-file/save-model-file.effect';
import { SaveModelFileReducer } from '@core/state/save-model-file/save-model-file.reducer';
import { SaveModelFileValidatorInterceptor } from '@core/state/save-model-file/save-model-file.validator';
import { CreateMissionImagesEffect } from '@shared-mission/state/effects';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { DeleteModelAction, DeleteModelReducer } from 'model/state-commands';
import { OptimisticHttpModule } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { MissionImageListRoutingModule } from './mission-image-list-routing.module';
import { MissionImageListComponent } from './mission-image-list/mission-image-list.component';

@NgModule({
  declarations: [MissionImageListComponent],
  imports: [
    SharedMissionModule,
    MissionImageListRoutingModule,      
    StateManagementModule.forFeature({
      reducers: [SaveModelFileReducer, DeleteModelReducer], 
      effects: [MailModelsHttpEffect, CreateMissionImagesEffect, SaveModelFileEffect], 
      actionInterceptors: [SaveModelFileValidatorInterceptor]
    }),      
    OptimisticHttpModule.forFeature({
      [DeleteModelAction]: GenericActionRequestMap[DeleteModelAction],   
      [SetSaveModelFileStateAction]: GenericActionRequestMap[SetSaveModelFileStateAction], 
    }),  
  ],
  providers:[]
})
export class MissionImageListModule {}
