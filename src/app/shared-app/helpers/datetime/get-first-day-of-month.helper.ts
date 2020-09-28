export function _getFirstDayOfMonth(date: Date | string = new Date()): Date  {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}