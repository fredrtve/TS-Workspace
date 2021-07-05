import { NgModule } from '@angular/core';
import { GenericActionRequestMap } from '@core/configurations/optimistic/generic-action-request-map.const';
import { SetSaveModelFileStateAction } from '@core/global-actions';
import { SaveModelFileEffect } from '@core/state/save-model-file/save-model-file.effect';
import { SaveModelFileReducer } from '@core/state/save-model-file/save-model-file.reducer';
import { SaveModelFileValidatorInterceptor } from '@core/state/save-model-file/save-model-file.validator';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { CreateMissionImagesEffect } from '@shared-mission/state/effects';
import { ModelFormModule } from 'model/form';
import { DeleteModelAction, ModelStateCommandsModule, SetSaveModelStateAction } from 'model/state-commands';
import { OptimisticHttpModule } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { DeleteMissionHeaderImageReducer, UpdateLastVisitedReducer } from './state/reducers.const';
import { MissionDetailsRoutingModule } from './mission-details-routing.module';
import { EmployerListItemComponent } from './mission-details/mission-details-view/employer-list-item.component';
import { MissionDetailsViewComponent } from './mission-details/mission-details-view/mission-details-view.component';
import { MissionDetailsComponent } from './mission-details/mission-details.component';
import { MissionDetailsActionRequestMap } from './mission-details-action-request-map.const';

@NgModule({
    declarations: [
        MissionDetailsComponent,
        MissionDetailsViewComponent,
        EmployerListItemComponent
    ],
    imports: [
        SharedMissionModule,
        MissionDetailsRoutingModule,    
        StateManagementModule.forFeature({
          reducers: [SaveModelFileReducer, UpdateLastVisitedReducer, DeleteMissionHeaderImageReducer], 
          effects: [CreateMissionImagesEffect, SaveModelFileEffect], 
          actionInterceptors: [SaveModelFileValidatorInterceptor],
        }), 
        ModelStateCommandsModule,
        ModelFormModule,     
        OptimisticHttpModule.forFeature(MissionDetailsActionRequestMap),  
    ],
    exports: []
})
export class MissionDetailsModule { }
