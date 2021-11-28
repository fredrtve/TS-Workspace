import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Mission } from '@core/models';
import { IPosition } from '@core/models/sub-interfaces/iposition.interface';
import { DeviceInfoService } from '@core/services/device-info.service';
import { GoogleMapsMarkerIcons } from '@shared-app/constants/google-maps-marker-icons.const';
import { Immutable } from '@fretve/global-types';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-mission-position-picker',
  templateUrl: './mission-position-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionPositionPickerComponent {
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

    @Input() mission: Immutable<Mission> | undefined;
    @Output() positionSelected = new EventEmitter<IPosition>()

    userPosition$: Observable<GeolocationPosition | null> = this.deviceInfoService.userLocation$.pipe(
        catchError(x => { return of(null) })
    );

    selectedPosition: google.maps.LatLngLiteral | null;

    userPositionMarkerOptions: google.maps.MarkerOptions = { 
        draggable: false, icon: { url: GoogleMapsMarkerIcons.Green } 
    }

    missionMarkerOptions: google.maps.MarkerOptions = { 
        draggable: false, icon: { url: GoogleMapsMarkerIcons.Blue } 
    }

    selectedPositionMarkerOptions: google.maps.MarkerOptions = { 
        draggable: false, icon: { url: GoogleMapsMarkerIcons.Red } 
    } 

    constructor(private deviceInfoService: DeviceInfoService) { }

    openInfoWindow(marker: MapMarker, description: string) {
        this.infoWindow.infoWindow?.setContent(description);
        this.infoWindow.open(marker);
    }

    updateSelectedMarker(event: google.maps.MapMouseEvent){ 
        this.selectedPosition = event.latLng.toJSON();
    }

    submitPosition(latitude: number, longitude: number): void {
        this.positionSelected.emit({ isExact: true, longitude, latitude });
        this.selectedPosition = null;
    }
}
