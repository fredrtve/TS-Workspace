import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mission } from '@core/models';
import { ImmutableArray } from 'global-types';

@Component({
  selector: 'app-home-mission-card',
  templateUrl: './home-mission-card.component.html',
  styleUrls: ['./home-mission-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMissionCardComponent {
 
    @Input() missions: ImmutableArray<Mission>;

    constructor() {} 

}
