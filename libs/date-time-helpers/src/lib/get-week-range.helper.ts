import { DateRange } from './interfaces';;
import { _getFirstDayOfWeek } from './get-first-day-of-week.helper';
import { _getLastDayOfWeek } from './get-last-day-of-week.helper';
import { Immutable } from '@fretve/global-types';

/**
 * Get a date range containing the start and end date of a specified week.
 * @param date - A date with the desired week
 * @param getISO - Set to true if you want the output as ISO strings
 */
export function _getWeekRange(date: Immutable<Date> = new Date(), getISO?: boolean): Immutable<DateRange> {
    const start = _getFirstDayOfWeek(date);   
    const end = _getLastDayOfWeek(date);
    return {
      start: getISO ? start.toISOString() : start, 
      end: getISO ? end.toISOString() : end
    };
}