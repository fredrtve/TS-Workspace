import { MissionChild } from './relationships/mission-child.interface';
import { TimesheetStatus } from 'src/app/shared-app/enums';
import { UserForeign } from './relationships/user-foreign.interface';
import { User } from './user.interface';


export interface Timesheet extends MissionChild, UserForeign {
    id?: string,
    userName?: string;
    user?: User;
    fullName?: string;

    status?: TimesheetStatus;
    comment?: string;
    
    startTime?: string;
    endTime?: string;
    totalHours?: number;
}
