import { StateMissions, StateTimesheets } from '@core/state/global-state.interfaces';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { _getRangeByDateRangePreset } from '@shared-app/helpers/get-range-by-date-range-preset.helper';
import { _addOrUpdateRange } from 'array-helpers';
import { DateRange } from 'date-time-helpers';
import { StateFetchingStatus } from 'model/state-fetcher/public-api';
import { _createReducer } from 'state-management';
import { FetchingTimesheetsFailedAction, SetCriteriaCacheAction, SetFetchedTimesheetsAction, SetTimesheetCriteriaAction } from './actions.const';
import { StateSharedTimesheet } from './state-shared-timesheet.interface';

export const SetTimesheetCriteriaReducer = _createReducer<unknown, SetTimesheetCriteriaAction>(
    SetTimesheetCriteriaAction, (state, action) => {
        let {dateRangePreset, dateRange, ...rest} = {...action.timesheetCriteria}

        if(dateRangePreset && dateRangePreset !== DateRangePresets.Custom && dateRangePreset !== DateRangePresets.CustomMonth )
            dateRange = <DateRange> _getRangeByDateRangePreset(dateRangePreset);

        return { [action.criteriaProp]: {dateRangePreset, dateRange, ...rest} }
    }       
) 

export const SetFetchedTimesheetsReducer = _createReducer<StateTimesheets & StateMissions & StateFetchingStatus<StateTimesheets>, SetFetchedTimesheetsAction>(
    SetFetchedTimesheetsAction, (state, action) => {
        return {
            timesheets: _addOrUpdateRange(state.timesheets, action.timesheets, "id"),
            fetchingStatus: {...state.fetchingStatus || {}, timesheets: "success"}
        };
    }
) 

export const SetCriteriaCacheReducer = _createReducer<StateSharedTimesheet, SetCriteriaCacheAction>(
    SetCriteriaCacheAction, (state, action) => {
        return {
            fetchingStatus: {...state.fetchingStatus, timesheets: "fetching"},
            timesheetCriteriaCache: [action.criteria, ...state.timesheetCriteriaCache || []]
        }
    }
)

export const RemoveCriteriaCacheReducer = _createReducer<StateSharedTimesheet, FetchingTimesheetsFailedAction>(
    FetchingTimesheetsFailedAction, (state) =>  {
        const [, ...rest] = state.timesheetCriteriaCache;
        return { timesheetCriteriaCache: rest }
    }
    
)

export const SetTimesheetFetchingFailedReducer = _createReducer<StateSharedTimesheet, FetchingTimesheetsFailedAction>(
    FetchingTimesheetsFailedAction, (state) => ({ fetchingStatus: {...state.fetchingStatus, timesheets: 'failed'}})
)