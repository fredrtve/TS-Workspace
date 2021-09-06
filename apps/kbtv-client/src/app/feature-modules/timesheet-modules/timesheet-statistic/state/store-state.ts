import { StateUsers, StateMissions, StateTimesheets } from '@core/state/global-state.interfaces';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { StateFetchingStatus } from 'model/state-fetcher';

export interface StoreState extends 
    StateUsers,
    StateMissions,
    StateTimesheets,
    StateFetchingStatus<StateTimesheets>{
        timesheetStatisticTimesheetCriteria: TimesheetCriteria,
        timesheetStatisticGroupBy: GroupByPeriod
}
