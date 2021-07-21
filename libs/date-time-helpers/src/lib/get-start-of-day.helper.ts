import { DateInput, Immutable } from "global-types";

/** Get the time in milliseconds at the start of a given day 
 *  @param date - A date input for the given day
 *  @returns The start of the given day in milliseconds 
*/
export function  _getStartOfDayTime(date: Immutable<DateInput>): number{
    const newDate = new Date(date as Date);
    newDate.setHours(0,0,0,0);
    return newDate.getTime();
}