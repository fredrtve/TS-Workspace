import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Get the first day of a specified month
 * @param date - A date with the desired month
 */
export function _getFirstDayOfMonth(date: Immutable<DateInput> = new Date()): Immutable<Date>  {
    const d = new Date(date as Date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}