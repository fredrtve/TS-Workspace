import { GroupByPeriod } from "@shared-app/enums/group-by-period.enum";
import { SharedTimesheetActions } from "@shared-timesheet/state/actions.const";
import { ModelFetcherActions } from "model/state-fetcher";
import { _createAction, _payload } from "state-management";

export const TimesheetStatisticActions = {
    setGroupBy: _createAction("Set Group By", _payload<{ groupBy: GroupByPeriod }>()),
    setTimesheetCriteria: SharedTimesheetActions.setTimesheetCriteria,
    fetchTimesheets: ModelFetcherActions.fetch
}