import { StateUsers, StateMissions, StateTimesheets, StateActivities, StateMissionActivities } from '@core/state/global-state.interfaces';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { StateFetchingStatus } from 'model/state-fetcher';

export interface StoreState extends 
    StateUsers,
    StateMissions,
    StateTimesheets,
    StateActivities,
    StateMissionActivities,
    StateFetchingStatus<StateTimesheets>{
        timesheetStatisticTimesheetCriteria: TimesheetCriteria,
        timesheetStatisticGroupBy: GroupByPeriod
}
