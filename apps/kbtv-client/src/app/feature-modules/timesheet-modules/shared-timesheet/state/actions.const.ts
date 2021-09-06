import { Timesheet } from "@core/models";
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { Immutable, Prop, UnknownState } from "global-types";
import { StateAction } from "state-management";

export const FetchTimesheetsAction = "FETCH_TIMESHEETS_ACTION";
export interface FetchTimesheetsAction extends StateAction<typeof FetchTimesheetsAction> {
    timesheetCriteria: TimesheetCriteria
}

export const FetchingTimesheetsFailedAction = "FETCHING_TIMESHEETS_FAILED_ACTION";
export interface FetchingTimesheetsFailedAction extends StateAction<typeof FetchingTimesheetsFailedAction> {}

export const  SetCriteriaCacheAction = "SET_CRITERIA_CACHE_ACTION";
export interface  SetCriteriaCacheAction extends StateAction<typeof  SetCriteriaCacheAction> { criteria: TimesheetCriteria }

export const SetFetchedTimesheetsAction = "SET_FETCHED_TIMESHEETS_ACTION";
export interface SetFetchedTimesheetsAction extends StateAction<typeof SetFetchedTimesheetsAction> {
    timesheets: Timesheet[]
}

export const SetTimesheetCriteriaAction = "SET_TIMESHEET_CRITERIA_ACTION";
export interface SetTimesheetCriteriaAction<TState = UnknownState> extends StateAction<typeof SetTimesheetCriteriaAction> {
    timesheetCriteria: Immutable<TimesheetCriteria>,
    criteriaProp: Prop<TState>
}
