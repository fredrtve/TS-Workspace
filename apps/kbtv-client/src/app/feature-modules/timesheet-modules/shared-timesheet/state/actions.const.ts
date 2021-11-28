import { Timesheet } from "@core/models";
import { TimesheetCriteria } from "@shared-timesheet/timesheet-filter/timesheet-criteria.interface";
import { Immutable, Prop, UnknownState } from "@fretve/global-types";
import { _createAction, _payload } from "state-management";

export const SharedTimesheetActions = {
    fetchTimesheets: _createAction("Fetch Timesheets", _payload<{ timesheetCriteria: TimesheetCriteria }>()),
    setFetchedTimesheets: _createAction("Set Fetched Timesheets", _payload<{ timesheets: Timesheet[] }>()),     
    fetchingFailed: _createAction("Fetching Timesheets Failed"),  
    setCriteriaCache: _createAction("Set Criteria Cache", _payload<{ criteria: TimesheetCriteria }>()),     
    setTimesheetCriteria: <TState>(payload: Immutable<SetTimesheetCriteriaPayload<TState>>) => 
        ({type: 'Set Timesheet Criteria', ...payload}),
}

export interface SetTimesheetCriteriaPayload<TState = UnknownState> {
    timesheetCriteria: Immutable<TimesheetCriteria>, 
    criteriaProp: Prop<TState>
}
