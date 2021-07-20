import { Timesheet } from "@core/models";
import { TimesheetSummary } from "../interfaces";
import { GroupByPeriod } from "@shared-app/enums/group-by-period.enum";
import { Immutable, ImmutableArray, Maybe } from "global-types";
import { _getDailySummaries } from "./get-daily-summaries.helper";
import { _getMonthlySummaries } from "./get-monthly-summaries.helper";
import { _getWeeklySummaries } from "./get-weekly-summaries.helper";
import { _getYearlySummaries } from "./get-yearly-summaries.helper";
import { _weakMemoizer } from "global-utils";

const getSummariesByType = (
  type: Maybe<GroupByPeriod>, 
  t: Maybe<ImmutableArray<Timesheet>>): Maybe<Immutable<TimesheetSummary>[]> => {
    switch (type) {
      case GroupByPeriod.Day:
        return _getDailySummaries(t);
      case GroupByPeriod.Week:
        return _getWeeklySummaries(t);
      case GroupByPeriod.Month:
        return _getMonthlySummaries(t);
      case GroupByPeriod.Year:
        return _getYearlySummaries(t);
      default: return null;
    }
}

export const _getSummariesByType = _weakMemoizer(getSummariesByType);
