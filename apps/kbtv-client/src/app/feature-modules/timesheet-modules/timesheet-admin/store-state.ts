import { StateActivities, StateLeaderSettings, StateMissionActivities, StateMissions, StateTimesheets, StateUsers } from '@core/state/global-state.interfaces';
import { Maybe } from 'global-types';
import { WeekCriteria } from '../shared-timesheet/interfaces';
import { TimesheetCriteria } from '../shared-timesheet/timesheet-filter/timesheet-criteria.interface';

export interface StoreState extends 
    StateUsers,
    StateMissions,
    StateTimesheets,
    StateActivities,
    StateMissionActivities,
    StateLeaderSettings {
        timesheetAdminTimesheetCriteria: TimesheetCriteria,
        timesheetAdminWeekCriteria: Omit<Partial<WeekCriteria>, "weekNr" | "weekDay">
        timesheetAdminSelectedWeekNr: Maybe<number>;
    }
