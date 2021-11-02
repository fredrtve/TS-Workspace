import { Mission, Employer, MissionActivity, MissionType, MissionImage, MissionDocument, MissionNote, Timesheet, User, InboundEmailPassword, UserTimesheet, Activity } from '../models';
import { LeaderSettings } from '../models/leader-settings.interface';
import { Maybe } from 'global-types';
import { CurrentUser } from 'state-auth';

export interface StateMissions { missions: Maybe<Mission[]> }  
export interface StateEmployers { employers: Maybe<Employer[]> }
export interface StateActivities { activities: Maybe<Activity[]> }
export interface StateMissionTypes { missionTypes: Maybe<MissionType[]> }
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