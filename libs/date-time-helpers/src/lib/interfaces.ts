/** Represents the range between two specified dates */
export interface DateRange<T extends Date | string | number = Date | string | number> {
    start: T;
    end: T;
}

/** Represents a week and year */
export interface WeekYear {
    weekNr: number;
    year: number;
}