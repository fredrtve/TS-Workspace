
import { WeekToTimesheetCriteriaAdapter } from "@shared-timesheet/timesheet-filter/week-to-timesheet-criteria.adapter";
import { _addOrUpdateRange } from "array-helpers";
import { _createReducers, _on } from "state-management";
import { StoreState } from "../store-state";
import { TimesheetAdminActions } from "./actions.const";

export const TimesheetAdminReducers = _createReducers<StoreState>(
    _on(TimesheetAdminActions.selectedWeekChanged, (state, {weekNr}) => {
        weekNr = (!weekNr || (typeof weekNr === "number")) ? <number> weekNr : parseInt(weekNr);
        return {timesheetAdminSelectedWeekNr: (!weekNr || (typeof weekNr === "number")) ? weekNr : parseInt(weekNr)}
    }),
    _on(TimesheetAdminActions.weekCriteriaChanged, (state, action) => {
        const weekCriteria = {...action.weekCriteria, weekNr: undefined}
        return {
            timesheetAdminTimesheetCriteria: new WeekToTimesheetCriteriaAdapter(weekCriteria),
            timesheetAdminWeekCriteria: weekCriteria
        }
    }),
    _on(TimesheetAdminActions.updateTimesheetStatuses, (state, action) => {
        const updatedTimesheets = action.ids.map(id => { return {id, status: action.status} });
        return {timesheets: _addOrUpdateRange(state.timesheets, updatedTimesheets, "id")}  
    }),
    _on(TimesheetAdminActions.updateLeaderSettingsSuccess, 
        (state, action) => ({ leaderSettings: {...state.leaderSettings, ...action.settings} }))
)