import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mission } from '@core/models';
import { Immutable } from 'global-types';

@Component({
  selector: 'app-mission-map-info-window',
  template: `
  <div *ngIf="mission" class="m-2">
    <a [routerLink]="[mission.id, 'detaljer']" class="mat-body-2">{{ mission.address }}</a>
    <div class="mat-caption color-warn" *ngIf="!mission.position!.isExact">Posisjonen kan være feil</div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionMapInfoWindowComponent{

    @Input() mission: Immutable<Mission>

}
