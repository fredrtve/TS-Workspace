import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { GlobalActions } from '@core/global-actions';
import { Mission } from '@core/models';
import { IPosition } from '@core/models/sub-interfaces/iposition.interface';
import { GoogleMapsLoader } from '@core/services/google-maps.loader';
import { StateMissions } from '@core/state/global-state.interfaces';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { SharedModule } from '@shared/shared.module';
import { _find } from 'array-helpers';
import { Immutable, Maybe } from 'global-types';
import { ModelCommand } from 'model/state-commands';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Store } from 'state-management';
import { MissionPositionSheetPickerData } from './mission-position-picker-sheet-data.interface';
import { MissionPositionPickerComponent } from './mission-position-picker.component';

export const SheetClosedByUserEvent = "CLOSED_BY_USER";

@Component({
 selector: "app-mission-position-picker-sheet-wrapper",
  template: `
    <style>
        :host {
            height:100%;
            display:flex;
            flex-direction: column;
        }
    </style>
    <ng-container *ngIf="mission$ | async; let mission">
        <app-main-top-nav-bar [config]="navConfig">Velg posisjon på kart</app-main-top-nav-bar>
        <span class="mb-3 ml-6 mr-6 ellipsis mat-body-2" data-cy="position-picker-address">
            Oppdrag: {{ mission?.address }}
        </span>
        <app-mission-position-picker [mission]="mission" 
            (positionSelected)="updateSelectedPosition($event)">
        </app-mission-position-picker>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionPositionPickerSheetWrapperComponent {

    mission$: Observable<Maybe<Immutable<Mission>>> = combineLatest([
        this.googleMapsLoader.load$,
        this.store.selectProperty$("missions").pipe(map(x => _find(x, this.data.missionId, "id"))),
    ]).pipe(
        switchMap(([loaded, mission]) => {
            if(mission?.position) return of(mission);
            else return this.geocoder.geocode({ address: mission?.address, region: "no"}).pipe(map(x => {
                const position = x.results?.[0]?.geometry.location.toJSON();
                return { ...mission, 
                    position: position ? { latitude: position.lat, longitude: position.lng } : undefined }
            }))
        })
    );
  
    navConfig: MainTopNavConfig = { customCancelFn: () => this.sheetRef.dismiss(SheetClosedByUserEvent) }

    constructor(
        private store: Store<StateMissions>,
        private geocoder: MapGeocoder,
        private sheetRef: MatBottomSheetRef,
        private googleMapsLoader: GoogleMapsLoader,
        @Inject(MAT_BOTTOM_SHEET_DATA) private data: MissionPositionSheetPickerData
    ) { }

    updateSelectedPosition(position: IPosition): void {
        this.store.dispatch(GlobalActions.saveModel({ 
            stateProp: "missions", 
            saveAction: ModelCommand.Update,
            entity: { id: this.data.missionId, position }
        }));
    }

}
@NgModule({
    declarations: [
        MissionPositionPickerSheetWrapperComponent,
        MissionPositionPickerComponent
    ],
    imports:[
      SharedModule,
      GoogleMapsModule
    ]
})
class MissionPositionPickerSheetWrapperModule {}
