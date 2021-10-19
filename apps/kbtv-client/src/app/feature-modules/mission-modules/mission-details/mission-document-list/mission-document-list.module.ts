import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { _deleteModelRequest, _setSaveModelFileRequest } from '@core/configurations/optimistic/global-action-requests';
import { MailModelsHttpEffect } from '@core/state/mail-models/mail-models.http.effect';
import { SaveModelFileEffect } from '@core/state/save-model-file/save-model-file.effect';
import { SaveModelFileReducer } from '@core/state/save-model-file/save-model-file.reducer';
import { SaveModelFileValidatorInterceptor } from '@core/state/save-model-file/save-model-file.validator';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { ModelStateCommandsModule } from 'model/state-commands';
import { OptimisticHttpModule, _createActionRequestMap } from 'optimistic-http';
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
      reducers: [SaveModelFileReducer], 
      effects: [MailModelsHttpEffect, SaveModelFileEffect], 
      actionInterceptors: [SaveModelFileValidatorInterceptor]
    }),
    ModelStateCommandsModule,
    OptimisticHttpModule.forFeature(_createActionRequestMap(
      _setSaveModelFileRequest,  
      _deleteModelRequest,
    )),  
    
  ],
  providers: [],
})
export class MissionDocumentListModule {}
