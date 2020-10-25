
import { GroupByPeriod } from 'src/app/shared/enums';
import { StateUsers, StateMissions, StateTimesheets } from 'src/app/core/services/state/interfaces';
import { TimesheetCriteria } from '../shared-timesheet/interfaces';

export interface StoreState extends 
    StateUsers,
    StateMissions,
    StateTimesheets{
        timesheetStatisticCriteria: TimesheetCriteria,
        timesheetStatisticGroupBy: GroupByPeriod
    }