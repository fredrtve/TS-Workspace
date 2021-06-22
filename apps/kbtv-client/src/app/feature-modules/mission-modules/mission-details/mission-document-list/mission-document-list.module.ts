import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenericActionRequestMap } from '@core/configurations/optimistic/generic-action-request-map.const';
import { SetSaveModelFileStateAction } from '@core/global-actions';
import { MailModelsHttpEffect } from '@core/state/mail-models/mail-models.http.effect';
import { SaveModelFileEffect } from '@core/state/save-model-file/save-model-file.effect';
import { SaveModelFileReducer } from '@core/state/save-model-file/save-model-file.reducer';
import { SaveModelFileValidatorInterceptor } from '@core/state/save-model-file/save-model-file.validator';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { ModelFormModule } from 'model/form';
import { DeleteModelAction, DeleteModelReducer } from 'model/state-commands';
import { OptimisticHttpModule } from 'optimistic-http';
import { AppRoute } from 'src/app/app-routing.module';
import { StateManagementModule } from 'state-management';
import { MissionDocumentListComponent } from './mission-document-list/mission-document-list.component';
import { FileExtensionIconPipe } from './pipes/file-extension-icon.pipe';
import { FileExtensionPipe } from './pipes/file-extension.pipe';

const Routes: AppRoute[] = [{ path: '', component: MissionDocumentListComponent }]

@NgModule({
  declarations: [
    MissionDocumentListComponent,
    FileExtensionIconPipe,
    FileExtensionPipe,
  ],
  imports: [
    RouterModule.forChild(Routes),
    SharedMissionModule, 
    StateManagementModule.forFeature({
      reducers: [SaveModelFileReducer, DeleteModelReducer], 
      effects: [MailModelsHttpEffect, SaveModelFileEffect], 
      actionInterceptors: [SaveModelFileValidatorInterceptor]
    }),
    ModelFormModule,
    OptimisticHttpModule.forFeature({
      [DeleteModelAction]: GenericActionRequestMap[DeleteModelAction],   
      [SetSaveModelFileStateAction]: GenericActionRequestMap[SetSaveModelFileStateAction], 
    }),  
    
  ],
  providers: [],
})
export class MissionDocumentListModule {}
