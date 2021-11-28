import { DateInput, Immutable } from '@fretve/global-types';
import { WeekYear } from './interfaces';

/**
 * Get the week and year of a specified date
 * @param date - 
 */
export function _getWeekYear(date: Immutable<DateInput> = new Date()): WeekYear {
    var d = new Date(date as Date);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    const year = d.getFullYear()
    return {
        year,
        weekNr: Math.ceil((((d.getTime() - new Date(year,0,1).getTime())/8.64e7)+1)/7)
    }
}