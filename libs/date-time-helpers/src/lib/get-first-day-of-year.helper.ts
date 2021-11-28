import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Get the first day of a specified year
 * @param date - A date with the desired year
 */
export function _getFirstDayOfYear(date: Immutable<DateInput> = new Date()): Immutable<Date>  {
    return new Date(new Date(date as Date).getFullYear(), 0, 1);
}