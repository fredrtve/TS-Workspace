import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mission } from '@core/models';
import { _trackByModel } from '@shared-app/helpers/trackby/track-by-model.helper';
import { ImmutableArray } from '@fretve/global-types';

@Component({
  selector: 'app-home-mission-card',
  templateUrl: './home-mission-card.component.html',
  styleUrls: ['./home-mission-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMissionCardComponent {
 
    @Input() missions: ImmutableArray<Mission>;

    constructor() {} 

    trackByMission = _trackByModel("missions");

}
