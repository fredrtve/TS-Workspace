import { Timesheet } from "@core/models";
import { TimesheetSummary } from "../interfaces";
import { Immutable, ImmutableArray, Maybe } from "@fretve/global-types";
import { _addHoursToSummary } from "./add-hours-to-summary.helper";

export function _getDailySummaries(t: Maybe<ImmutableArray<Timesheet>>): Maybe<Immutable<TimesheetSummary>[]> {
    if(!t) return null;
    const groups: {[key:string]: TimesheetSummary} = {};
    for(let i = t.length; i--;){
      const timesheet = t[i];
      const date = timesheet.startTime ? new Date(timesheet.startTime) : new Date();
      const index = date.toDateString() + "-" + timesheet.userName;
      let summary = groups[index];
      if(summary === undefined) {
        groups[index] = {
          userName: timesheet.userName,
          date,
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