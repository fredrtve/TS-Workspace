import { GroupByPeriod } from "@shared-app/enums/group-by-period.enum";
import { _createAction, _payload } from "state-management";

export const TimesheetStatisticActions = {
    setGroupBy: _createAction("Set Group By", _payload<{ groupBy: GroupByPeriod }>())
}