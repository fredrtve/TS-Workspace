import { Employer } from '@core/models';
import { DateRange } from 'date-time-helpers';

export interface MissionCriteria {
    searchString?: string;    
    finished?: boolean; 
    employer?: Employer; 
    dateRange?: DateRange;
}