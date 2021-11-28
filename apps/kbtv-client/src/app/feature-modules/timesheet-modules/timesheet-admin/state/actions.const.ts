import { LeaderSettings } from "@core/models/leader-settings.interface";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { WeekCriteria } from "@shared-timesheet/interfaces";
import { Maybe } from "@fretve/global-types";
import { ModelFetcherActions } from "model/state-fetcher";
import { _createAction, _payload } from "state-management";

export const TimesheetAdminActions = {
    weekCriteriaChanged: _createAction("Week Criteria Changed", _payload<{ weekCriteria: Partial<WeekCriteria> }>()),
    selectedWeekChanged: _createAction("Selected Week Changed", _payload<{ weekNr: Maybe<number | string> }>()),
    updateTimesheetStatuses: _createAction("Update Timesheet Statuses", _payload<{ ids: string[], status: TimesheetStatus }>()),
    updateLeaderSettings: _createAction("Update Leader Settings", _payload<{ settings: LeaderSettings }>()),
    updateLeaderSettingsSuccess: _createAction("Update Leader Settings Success", _payload<{ settings: LeaderSettings }>()),
    fetchTimesheets: ModelFetcherActions.fetch
}