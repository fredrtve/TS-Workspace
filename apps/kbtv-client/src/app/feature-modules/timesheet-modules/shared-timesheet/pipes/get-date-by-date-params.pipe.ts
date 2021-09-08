import { Pipe, PipeTransform } from '@angular/core';
import { DateParams } from '@shared-app/interfaces/date-params.interface';
import { _getDateByDateParams } from '../helpers/get-date-by-date-params.helper';
import { Immutable, Maybe } from 'global-types';

@Pipe({name: 'getDateByDateParams'})
export class GetDateByDateParamsPipe implements PipeTransform {
  constructor(){}

  transform(dp: Maybe<DateParams>, weekDayOverride: number): Immutable<Date> {
    if(!dp) return new Date();
    return _getDateByDateParams(dp.year, dp.weekNr, (weekDayOverride - 1) || dp.weekDay);
  }

}
