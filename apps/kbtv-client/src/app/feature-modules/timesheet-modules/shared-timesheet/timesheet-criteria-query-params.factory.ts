import { HttpParams } from "@angular/common/http";
import { Immutable } from "@fretve/global-types";
import { TimesheetCriteria } from "./timesheet-filter/timesheet-criteria.interface";

export function _timesheetCriteriaQueryParamsFactory(criteria: Immutable<TimesheetCriteria>): HttpParams {
    let params = new HttpParams();

    if (criteria.user?.userName) params = params.set("UserName", criteria.user.userName);

    if (criteria.dateRange) {
      if (criteria.dateRange.start)
        params = params.set(
          "StartDate",
          new Date(criteria.dateRange.start as Date).getTime().toString()
        );
      if (criteria.dateRange.end)
        params = params.set(
          "EndDate",
          new Date(criteria.dateRange.end as Date).getTime().toString()
        );
    }
    if (criteria.mission?.id)
      params = params.set("MissionId", criteria.mission.id.toString());

    return params
};