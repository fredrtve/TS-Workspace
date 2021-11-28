import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Get the last day of a specified month
 * @param date - A date with the desired month
 */
export function _getLastDayOfMonth(date: Immutable<DateInput> = new Date()): Immutable<Date>  {
    const d = new Date(date as Date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}