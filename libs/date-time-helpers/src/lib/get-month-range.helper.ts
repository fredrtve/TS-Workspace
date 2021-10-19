import { DateRange } from './interfaces';;
import { _getFirstDayOfMonth } from './get-first-day-of-month.helper';
import { _getLastDayOfMonth } from './get-last-day-of-month.helper';
import { DateInput, Immutable } from 'global-types';

/**
 * Get a date range containing the start and end date of a specified month.
 * @param date - A date with the desired month
 * @param getISO - Set to true if you want the output as ISO strings
 */
export function _getMonthRange<TAsIso extends boolean = false>(
    date: Immutable<DateInput> = new Date(), 
    getISO?: TAsIso
): Immutable<TAsIso extends true ? DateRange<string> : DateRange> {
    const start = _getFirstDayOfMonth(date);   
    const end = _getLastDayOfMonth(date);
    return <Immutable<TAsIso extends true ? DateRange<string> : DateRange>> {
      start: getISO ? start.toISOString() : start, 
      end: getISO ? end.toISOString() : end
    };
}
