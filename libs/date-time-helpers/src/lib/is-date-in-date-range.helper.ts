import { Immutable, DateInput, Maybe } from "@fretve/global-types";
import { _getStartOfDayTime } from "./get-start-of-day.helper";
import { DateRange } from "./interfaces";

/** Check if a date is contained in a date range. 
 * @param date - A date input that should be checked
 * @param dateRange - A date range the date should be contained in
 * @returns Returns true if the date is contained in the date range, else false.
*/
export function _isDateInDateRange(date: Immutable<Maybe<DateInput>>, dateRange: Immutable<Partial<DateRange>>): boolean {
    if(!date) return false;

    let startOfDay = _getStartOfDayTime(date);
    let exp = true;

    if(dateRange.start) {                
        exp = exp && startOfDay >= _getStartOfDayTime(dateRange.start);
        if(exp === false) return exp;
    }
   

    if(dateRange.end)
        exp = exp && startOfDay <= _getStartOfDayTime(dateRange.end); 

    return exp;
}