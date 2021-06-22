import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { SetMissionCriteriaReducer } from '@shared-mission/state/reducers.const';
import { StateManagementModule } from 'state-management';
import { MissionMapRoutingModule } from './mission-map-routing.module';
import { MissionMapInfoWindowComponent } from './mission-map/mission-map-info-window.component';
import { MissionMapViewComponent } from './mission-map/mission-map-view/mission-map-view.component';
import { MissionMapComponent } from './mission-map/mission-map.component';
import { MissionMarkerOptionsPipe } from './pipes/mission-marker-options.pipe';

@NgModule({
  declarations: [
    MissionMapComponent,
    MissionMapViewComponent,
    MissionMarkerOptionsPipe,
    MissionMapInfoWindowComponent
  ],
  imports: [
    SharedMissionModule,
    MissionMapRoutingModule,   
    GoogleMapsModule, 
    StateManagementModule.forFeature({reducers: [SetMissionCriteriaReducer]}), 
  ],
  providers: []
})
export class MissionMapModule {}
