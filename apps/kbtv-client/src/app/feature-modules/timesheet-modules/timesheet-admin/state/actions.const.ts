import { LeaderSettings } from "@core/models/leader-settings.interface";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { WeekCriteria } from "@shared-timesheet/interfaces";
import { Maybe } from "global-types";
import { StateAction } from "state-management";


export const SetTimesheetCriteriaWithWeekCriteriaAction = "SET_TIMESHEET_CRITERIA_WITH_WEEK_CRITERIA_ACTION";
export interface SetTimesheetCriteriaWithWeekCriteriaAction extends StateAction<typeof SetTimesheetCriteriaWithWeekCriteriaAction> {
    weekCriteria: WeekCriteria
}

export const SetSelectedWeekAction = "SET_SELECTED_WEEK_ACTION";
export interface SetSelectedWeekAction extends StateAction<typeof SetSelectedWeekAction> {
    weekNr: Maybe<number | string>
}

export const UpdateTimesheetStatusesAction = "UPDATE_TIMESHEET_STATUSES_ACTION";
export interface UpdateTimesheetStatusesAction extends StateAction<typeof UpdateTimesheetStatusesAction>{
    ids: string[],
    status: TimesheetStatus,
    type: typeof UpdateTimesheetStatusesAction
}

export const UpdateLeaderSettingsAction = "UPDATE_LEADER_SETTINGS_ACTION";
export interface UpdateLeaderSettingsAction extends StateAction<typeof UpdateLeaderSettingsAction> {
    settings: LeaderSettings;
}

export const UpdateLeaderSettingsSuccessAction = "UPDATE_LEADER_SETTINGS_SUCCESS_ACTION";
export interface UpdateLeaderSettingsSuccessAction extends StateAction<typeof UpdateLeaderSettingsSuccessAction> {
    settings: LeaderSettings;
}