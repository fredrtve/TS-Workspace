import { Immutable } from '@fretve/global-types';

/**
 * Get the last day of a specified week
 * @param date - A date with the desired week
 */
export function _getLastDayOfWeek(date: Immutable<Date> = new Date()): Date  {
    let day = date.getDay();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (day == 0 ? 0 : 7) - day,
      23,59,59
    );
 }