import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Get the last day of a specified year
 * @param date - A date with the desired year
 */
export function _getLastDayOfYear(date: Immutable<DateInput> = new Date()): Immutable<Date> {
    return new Date(new Date(date as Date).getFullYear(), 11, 31, 23, 59, 59);
}