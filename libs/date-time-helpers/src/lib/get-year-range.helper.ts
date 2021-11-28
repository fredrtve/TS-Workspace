import { DateRange } from './interfaces';;
import { _getFirstDayOfYear } from './get-first-day-of-year.helper';
import { _getLastDayOfYear } from './get-last-day-of-year.helper';
import { Immutable } from '@fretve/global-types';

/**
 * Get a date range containing the start and end date of a specified year.
 * @param date - A date with the desired year
 * @param getISO - Set to true if you want the output as ISO strings
 */
export function _getYearRange(date: Immutable<Date> = new Date(), getISO?: boolean): Immutable<DateRange> {
    const start = _getFirstDayOfYear(date);   
    const end = _getLastDayOfYear(date);
    return {
      start: getISO ? start.toISOString() : start, 
      end: getISO ? end.toISOString() : end
    };
}