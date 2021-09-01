
import { StateTimesheets } from "@core/state/global-state.interfaces";
import { WeekToTimesheetCriteriaAdapter } from "@shared-timesheet/timesheet-filter/week-to-timesheet-criteria.adapter";
import { _addOrUpdateRange } from "array-helpers";
import { _createReducer } from "state-management";
import { StoreState } from "../store-state";
import { SetSelectedWeekAction, SetTimesheetCriteriaWithWeekCriteriaAction, UpdateLeaderSettingsSuccessAction, UpdateTimesheetStatusesAction } from "./actions.const";

export const SetSelectedWeekReducer = _createReducer<StoreState,SetSelectedWeekAction>(
    SetSelectedWeekAction, (state, {weekNr}) => {
        weekNr = (!weekNr || (typeof weekNr === "number")) ? <number> weekNr : parseInt(weekNr);
        return {timesheetAdminSelectedWeekNr: (!weekNr || (typeof weekNr === "number")) ? weekNr : parseInt(weekNr)}
    }   
)

export const SetTimesheetCriteriaWithWeekCriteriaReducer = _createReducer<StoreState, SetTimesheetCriteriaWithWeekCriteriaAction>(
    SetTimesheetCriteriaWithWeekCriteriaAction, (state, action) => {
        const weekCriteria = {...action.weekCriteria, weekNr: undefined}
        return {
            timesheetAdminTimesheetCriteria: new WeekToTimesheetCriteriaAdapter(weekCriteria),
            timesheetAdminWeekCriteria: weekCriteria
        }
    }     
) 

export const UpdateLeaderSettingsSuccessReducer = _createReducer<StoreState, UpdateLeaderSettingsSuccessAction>(
    UpdateLeaderSettingsSuccessAction,
    (state, action)=> { return { leaderSettings: {...state.leaderSettings, ...action.settings} } }     
) 

export const UpdateTimesheetStatusesReducer = _createReducer<StateTimesheets,UpdateTimesheetStatusesAction>(
    UpdateTimesheetStatusesAction, (state, action) => {
        const updatedTimesheets = action.ids.map(id => { return {id, status: action.status} });
        return {timesheets: _addOrUpdateRange(state.timesheets, updatedTimesheets, "id")}  
    }
)