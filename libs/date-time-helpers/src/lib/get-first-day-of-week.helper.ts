import { Immutable } from '@fretve/global-types';

/**
 * Get the first day of a specified week
 * @param date - A date with the desired week
 */
export function _getFirstDayOfWeek(date: Immutable<Date> = new Date()): Date  {
    let day = date.getDay();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (day == 0 ? -6 : 1) - day
    );
  }