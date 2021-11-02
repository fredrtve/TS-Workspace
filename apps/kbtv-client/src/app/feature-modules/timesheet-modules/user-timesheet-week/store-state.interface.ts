import { StateUserTimesheets, StateMissions, StateMissionActivities, StateActivities } from '@core/state/global-state.interfaces';
import { WeekCriteria } from '../shared-timesheet/interfaces';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';

export interface StoreState extends StateUserTimesheets, StateMissions, StateMissionActivities, StateActivities {}

export interface ComponentStoreState { 
    timesheetCriteria: Partial<TimesheetCriteria>,
    weekCriteria: Partial<WeekCriteria>,
}
