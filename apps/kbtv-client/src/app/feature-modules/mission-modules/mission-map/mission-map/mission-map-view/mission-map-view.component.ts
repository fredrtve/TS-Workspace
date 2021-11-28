import { ChangeDetectionStrategy, Component, ComponentFactory, ComponentFactoryResolver, Injector, Input, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Mission } from '@core/models';
import { DeviceInfoService } from '@core/services/device-info.service';
import { GoogleMapsLoader } from '@core/services/google-maps.loader';
import { _trackByModel } from '@shared-app/helpers/trackby/track-by-model.helper';
import { Immutable, Maybe } from '@fretve/global-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MissionMapInfoWindowComponent } from '../mission-map-info-window.component';

@Component({
  selector: 'app-mission-map-view',
  templateUrl: './mission-map-view.component.html',
  styleUrls: ['./mission-map-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionMapViewComponent{
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
    
    @Input() missions: Immutable<Maybe<Mission[]>>;

    center$: Observable<google.maps.LatLngLiteral> = 
        this.deviceInfoService.userLocation$.pipe(map(pos => { return {
            lng: pos.coords.longitude, lat: pos.coords.latitude
        }}));
    
    mapsLoaded$: Observable<boolean> = this.googleMapsLoader.load$;

    private infoWindowContentFac: ComponentFactory<MissionMapInfoWindowComponent>;

    constructor(
        private deviceInfoService: DeviceInfoService,
        private googleMapsLoader: GoogleMapsLoader,
        private cfr: ComponentFactoryResolver,
        private injector: Injector
    ) { 
        this.infoWindowContentFac = this.cfr.resolveComponentFactory(MissionMapInfoWindowComponent);
    }

    openInfoWindow(marker: MapMarker, mission: Mission) {
        const comp = this.infoWindowContentFac.create(this.injector);
        comp.instance.mission = mission;
        comp.changeDetectorRef.detectChanges();
        this.infoWindow.infoWindow?.setContent(comp.location.nativeElement);
        comp.destroy();
        this.infoWindow.open(marker);
    }

    trackByFn = _trackByModel("missions");


}
