import { StateTimesheets } from "@core/state/global-state.interfaces";
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { StateFetchingStatus } from 'model/state-fetcher';

export interface StateSharedTimesheet extends StateTimesheets, StateFetchingStatus<StateTimesheets> {
    timesheetCriteriaCache: TimesheetCriteria[];
}