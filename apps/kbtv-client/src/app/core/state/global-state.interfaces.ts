import { Maybe } from 'global-types';
import { CurrentUser } from 'state-auth';
import { Activity, Employer, InboundEmailPassword, Mission, MissionActivity, MissionDocument, MissionImage, MissionNote, Timesheet, User, UserTimesheet } from '../models';
import { LeaderSettings } from '../models/leader-settings.interface';

export interface StateMissions { missions: Maybe<Mission[]> }  
export interface StateEmployers { employers: Maybe<Employer[]> }
export interface StateActivities { activities: Maybe<Activity[]> }
export interface StateMissionImages { missionImages: Maybe<MissionImage[]> }
export interface StateMissionDocuments { missionDocuments: Maybe<MissionDocument[]> }
export interface StateMissionNotes { missionNotes: Maybe<MissionNote[]> }
export interface StateMissionActivities { missionActivities: Maybe<MissionActivity[]> }
export interface StateUserTimesheets { userTimesheets: Maybe<UserTimesheet[]> }
export interface StateCurrentUser { currentUser: Maybe<User & CurrentUser> }
export interface StateUsers { users: Maybe<User[]> }
export interface StateInboundEmailPassword { inboundEmailPasswords: Maybe<InboundEmailPassword[]> }
export interface StateTimesheets { timesheets: Maybe<Timesheet[]> }
export interface StateLeaderSettings { leaderSettings: Maybe<LeaderSettings> }