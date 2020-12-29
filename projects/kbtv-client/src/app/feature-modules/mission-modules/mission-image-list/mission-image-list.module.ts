import { NgModule } from '@angular/core';
import { DeleteModelProviders, MailModelsProviders } from 'state-model';
import { SharedModule } from '@shared/shared.module';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management'
import { SelectableListModule } from 'selectable-list';
import { CreateMissionImagesHttpEffect } from './create-mission-images/create-mission-images.http.effect';
import { CreateMissionImagesReducer } from './create-mission-images/create-mission-images.reducer';
import { ImageViewerDialogWrapperComponent } from './image-viewer/image-viewer-dialog-wrapper.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { MissionImageListRoutingModule } from './mission-image-list-routing.module';
import { MissionImageListComponent } from './mission-image-list/mission-image-list.component';


@NgModule({
  declarations: [
    MissionImageListComponent,
    ImageViewerDialogWrapperComponent,
    ImageViewerComponent,
  ],
  imports: [
    SharedModule,
    SelectableListModule,
    MissionImageListRoutingModule,
  ],
  providers:[
    { provide: STORE_REDUCERS, useValue: CreateMissionImagesReducer, multi: true},
    { provide: STORE_EFFECTS, useClass: CreateMissionImagesHttpEffect, multi: true},
    ...MailModelsProviders,
    ...DeleteModelProviders
  ]
})
export class MissionImageListModule {}
