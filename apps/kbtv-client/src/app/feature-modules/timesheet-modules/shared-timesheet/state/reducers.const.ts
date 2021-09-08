import { ModelState } from '@core/state/model-state.interface';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { _getRangeByDateRangePreset } from '@shared-app/helpers/get-range-by-date-range-preset.helper';
import { _addOrUpdateRange } from 'array-helpers';
import { DateRange } from 'date-time-helpers';
import { _createReducers, _on } from 'state-management';
import { SharedTimesheetActions } from './actions.const';
import { StateSharedTimesheet } from './state-shared-timesheet.interface';

export const FetchTimesheetReducers = _createReducers<ModelState & StateSharedTimesheet>(
    _on(SharedTimesheetActions.setFetchedTimesheets, (state, action) => ({
        timesheets: _addOrUpdateRange(state.timesheets, action.timesheets, "id"),
        fetchingStatus: {...state.fetchingStatus || {}, timesheets: "success"}
    })),
    _on(SharedTimesheetActions.setCriteriaCache, (state, action) => ({
        fetchingStatus: {...state.fetchingStatus, timesheets: "fetching"},
        timesheetCriteriaCache: [action.criteria, ...state.timesheetCriteriaCache || []]
    })),
    _on(SharedTimesheetActions.fetchingFailed, (state) => {
        const [, ...rest] = state.timesheetCriteriaCache; //Remove first entry from cache
        return { timesheetCriteriaCache: rest }
    }),
    _on(SharedTimesheetActions.fetchingFailed, (state) => ({ 
        fetchingStatus: {...state.fetchingStatus, timesheets: 'failed'}
    })),
);

export const SetTimesheetCriteriaReducer = _on(
    SharedTimesheetActions.setTimesheetCriteria, (state, action) => {
        let {dateRangePreset, dateRange, ...rest} = {...action.timesheetCriteria}

        if(dateRangePreset && dateRangePreset !== DateRangePresets.Custom && dateRangePreset !== DateRangePresets.CustomMonth )
            dateRange = <DateRange> _getRangeByDateRangePreset(dateRangePreset);

        return { [action.criteriaProp]: {dateRangePreset, dateRange, ...rest} }
    }       
) 