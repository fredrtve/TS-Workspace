import { Pipe, PipeTransform } from '@angular/core';
import { IPosition } from '@core/models/sub-interfaces/iposition.interface';
import { Maybe } from '@fretve/global-types';

@Pipe({name: 'appConvertToGooglePosition'})
export class ConvertToGooglePositionPipe implements PipeTransform {

  transform(position: Maybe<IPosition>): google.maps.LatLngLiteral | null {
    if(!position) return null;
    return {
      lat: position.latitude,
      lng: position.longitude
    };
  }

}
