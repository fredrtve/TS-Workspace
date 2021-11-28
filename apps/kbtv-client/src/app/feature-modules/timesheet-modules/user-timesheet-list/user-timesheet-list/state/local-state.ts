import { DateRangePresets } from "@shared-app/enums/date-range-presets.enum";
import { _getRangeByDateRangePreset } from "@shared-app/helpers/get-range-by-date-range-preset.helper";
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { DateRange } from "date-time-helpers";
import { DateInput } from "@fretve/global-types";
import { _createAction, _createReducers, _on, _payload } from "state-management";
import { UserTimesheetListState } from "./user-timesheet-list.state";

export const UserTimesheetListLocalActions = {
    setTimesheetCriteria: _createAction("", _payload<{ timesheetCriteria: Partial<TimesheetCriteria>, lowerBound: DateInput }>())
}

export const UserTimesheetListLocalReducers = _createReducers<UserTimesheetListState>(
    _on(UserTimesheetListLocalActions.setTimesheetCriteria, (state, action) => {
        let {dateRangePreset, dateRange, ...rest} = {...action.timesheetCriteria}

        if(dateRangePreset && dateRangePreset !== DateRangePresets.Custom && dateRangePreset !== DateRangePresets.CustomMonth )
            dateRange = <DateRange> _getRangeByDateRangePreset(dateRangePreset, undefined, <DateInput> action.lowerBound);

        return { timesheetCriteria: <TimesheetCriteria> {dateRangePreset, dateRange, ...rest} }
    })
)
