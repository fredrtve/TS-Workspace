import { User } from '@core/models';
import { DateParams } from '@shared-app/interfaces/date-params.interface';

export interface WeekCriteria extends DateParams{
    year: number, 
    weekNr: number, 
    weekDay: number,
    user: User
}
