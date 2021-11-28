
import { Pipe, PipeTransform } from '@angular/core';
import { Mission } from '@core/models';
import { Immutable } from '@fretve/global-types';

@Pipe({name: 'appMissionDirectionsUrl'})
export class MissionDirectionsUrlPipe implements PipeTransform {

  transform(mission: Immutable<Mission>): string {
    const desination = !mission.position ? mission.address :
        (mission.position.latitude + ',' + mission.position.longitude);
        
    return `https://www.google.com/maps/dir/?api=1&destination=${desination}&travelmode=driving`
  }

}