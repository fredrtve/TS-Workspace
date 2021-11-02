import { TimesheetSummary } from "../interfaces/timesheet-summary.interface";

export function _isTimesheetSummary(t: any): t is TimesheetSummary {
    return (t.confirmedHours || t.openHours) && t.timesheets
}