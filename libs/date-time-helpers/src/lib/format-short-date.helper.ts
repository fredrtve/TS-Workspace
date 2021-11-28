import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Formats a date to a short string. Format dd.m.yy.
 * @param d - The date to format
 * @returns a date string with format dd.m.yy
 */
export function _formatShortDate(d: Immutable<DateInput>): string{
    const date = new Date(d as Date);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear().toString().slice(2,4);
}