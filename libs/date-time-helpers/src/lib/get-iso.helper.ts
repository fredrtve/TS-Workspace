import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Get an ISO date string from a {@link DateInput}
 * @param date -
 */
export function _getISO(date: Immutable<DateInput>): string{
    return new Date(date as Date).toISOString()
}