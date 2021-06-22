import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenericActionRequestMap } from '@core/configurations/optimistic/generic-action-request-map.const';
import { SetSaveModelFileStateAction } from '@core/global-actions';
import { MailModelsHttpEffect } from '@core/state/mail-models/mail-models.http.effect';
import { SaveModelFileEffect } from '@core/state/save-model-file/save-model-file.effect';
import { SaveModelFileReducer } from '@core/state/save-model-file/save-model-file.reducer';
import { SaveModelFileValidatorInterceptor } from '@core/state/save-model-file/save-model-file.validator';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { CreateMissionImagesEffect } from '@shared-mission/state/effects';
import { DeleteModelAction, DeleteModelReducer } from 'model/state-commands';
import { OptimisticHttpModule } from 'optimistic-http';
import { AppRoute } from 'src/app/app-routing.module';
import { StateManagementModule } from 'state-management';
import { MissionImageListComponent } from './mission-image-list/mission-image-list.component';

const Routes: AppRoute[] = [{ path: '', component: MissionImageListComponent }];

@NgModule({
  declarations: [MissionImageListComponent],
  imports: [
    SharedMissionModule,
    RouterModule.forChild(Routes),      
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
