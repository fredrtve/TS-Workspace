/**
 * Get a date that belongs to a specified week and year. 
 * @param w - The week you need a date from
 * @param y - The year you need a date from
 */
export function _getDateOfWeek(w: number, y: number): Date {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}
