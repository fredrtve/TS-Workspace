import { DateInput, Immutable, ImmutableObject } from '@fretve/global-types';

/**
 * Merge a date value and a time value to a datetime value. 
 * @param date - A date input specifying the date of the result.  
 * @param time - A date input specifying the time of the result.
 */
export function _mergeDateAndTime(date: ImmutableObject<DateInput> = new Date(), time: Immutable<DateInput>): Immutable<Date>{
    const d = new Date(date as Date);
    const t = new Date(time as Date);
    d.setHours(t.getHours(), t.getMinutes(), t.getSeconds());
    return d;
}