import { DateRange, _getISO } from "date-time-helpers";
import { Immutable } from "global-types";

export function _getISODateRange(dateRange: Immutable<Partial<DateRange>>): Immutable<Partial<DateRange<string>>> {
    return {
        start: dateRange.start ? _getISO(dateRange.start) : undefined, 
        end: dateRange.end ? _getISO(dateRange.end) : undefined, 
    }
}