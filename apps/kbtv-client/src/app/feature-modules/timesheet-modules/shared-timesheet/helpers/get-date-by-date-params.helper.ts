import { _getDateOfWeek, _getFirstDayOfWeek } from 'date-time-helpers';
import { Immutable } from '@fretve/global-types';
import { _weakMemoizer } from '@fretve/global-utils';

export const _getDateByDateParams = _weakMemoizer(getDateByDateParams)

function getDateByDateParams(year?: number, weekNr?: number, weekDay?: number): Immutable<Date> {
    if(!weekNr || !year) return new Date();

    let date = _getFirstDayOfWeek(_getDateOfWeek(weekNr, year || new Date().getFullYear()));

    if(weekDay)
      date.setDate(date.getDate() + weekDay);

    return date;
}

