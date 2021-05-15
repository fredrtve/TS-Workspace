import { Immutable, Maybe } from 'global-types';
import { TimesheetSummary, WeekCriteria } from '../../shared-timesheet/interfaces';

export interface ViewModel{ 
    weekDaySummaries: Maybe<{[key: number]: Immutable<TimesheetSummary>}>, 
    weekCriteria: Maybe<Immutable<Partial<WeekCriteria>>>, 
    numberOfWeekDays: number
}