
import { Maybe } from 'global-types';
import { Activity } from './activity.interface';
import { Model } from './base-entity.interface';
import { MissionChild } from './relationships/mission-child.interface';
import { IId } from './sub-interfaces/iid.interface';
import { Timesheet, UserTimesheet } from './timesheet.interface';

export interface MissionActivity extends Model, MissionChild, IId { 
    activityId?: string;
    activity?: Maybe<Activity>;

    timesheets?: Timesheet[];
    userTimesheets?: UserTimesheet[];

    MissionActivity?: string,
}
