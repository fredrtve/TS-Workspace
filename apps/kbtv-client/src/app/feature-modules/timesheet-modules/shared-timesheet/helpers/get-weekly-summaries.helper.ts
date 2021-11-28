import { Timesheet } from "@core/models";
import { TimesheetSummary } from "../interfaces";
import { Immutable, ImmutableArray, Maybe } from "@fretve/global-types";
import { _addHoursToSummary } from "./add-hours-to-summary.helper";
import { _getWeekYear } from "date-time-helpers";

export function _getWeeklySummaries(t: Maybe<ImmutableArray<Timesheet>>): Maybe<Immutable<TimesheetSummary>[]> {
    if(!t) return null;
    const groups: {[key:string]: TimesheetSummary} = {};
    for(let i = t.length; i--;){
      const timesheet = t[i];
      const {weekNr, year} = _getWeekYear(timesheet.startTime);
      const index = year + "-" + weekNr + "-" + timesheet.userName;
      let summary = groups[index];
      if (summary === undefined) {
        groups[index] = {
          userName: timesheet.userName,
          year: year,
          weekNr: weekNr,
          openHours: 0,
          confirmedHours: 0,
          timesheets: [],
        };
        summary = groups[index];
      }  

      _addHoursToSummary(summary, timesheet)

      summary.timesheets.push(<Timesheet> timesheet);
    }

    return <Immutable<TimesheetSummary>[]> Object.values(groups);
  }