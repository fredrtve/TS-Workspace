import { SetTimesheetCriteriaReducer } from '@shared-timesheet/state/reducers.const';
import { _createReducers, _on } from 'state-management';
import { TimesheetStatisticActions } from './actions.const';
import { StoreState } from './store-state';

export const TimesheetStatisticReducers = _createReducers<StoreState>(
    _on(TimesheetStatisticActions.setGroupBy, (state, action) => ({ timesheetStatisticGroupBy: action.groupBy })),
    SetTimesheetCriteriaReducer
)