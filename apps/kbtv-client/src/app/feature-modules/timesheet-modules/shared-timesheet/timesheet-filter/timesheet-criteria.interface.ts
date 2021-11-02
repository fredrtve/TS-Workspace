import { Activity, Mission, User } from '@core/models';
import { DateRangePresets } from '@shared-app/enums/date-range-presets.enum';
import { TimesheetStatus } from '@shared-app/enums/timesheet-status.enum';
import { DateRange } from 'date-time-helpers';

export interface TimesheetCriteria{
    status?: TimesheetStatus;    
    mission?: Mission;
    activity?: Activity;
    user?: User;
    dateRange?: DateRange; 
    dateRangePreset?: DateRangePresets;
}