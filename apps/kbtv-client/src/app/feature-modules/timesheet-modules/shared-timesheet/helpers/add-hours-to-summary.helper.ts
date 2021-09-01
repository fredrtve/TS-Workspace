import { Timesheet } from "@core/models";
import { TimesheetSummary } from "../interfaces";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { Immutable } from "global-types";

export function _addHoursToSummary(summary: TimesheetSummary, timesheet: Immutable<Timesheet>): void{
    if(!timesheet) return;
    if (timesheet.status === TimesheetStatus.Confirmed)
      summary.confirmedHours = summary.confirmedHours + <number> timesheet.totalHours;
    else   
      summary.openHours = summary.openHours + <number> timesheet.totalHours;
}