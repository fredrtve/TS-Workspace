import { DateInput, Immutable } from '@fretve/global-types';

/**
 * Get a UNIX timestamp for a specified date in seconds. 
 * @param date - 
 */
export function _getUnixTimeSeconds(date: Immutable<DateInput> = new Date()){
    return Math.floor(new Date(date as Date).getTime() / 1000)
}