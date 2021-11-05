import { StateCurrentUser, StateLeaderSettings } from '../state/global-state.interfaces';
import { ModelState } from '../state/model-state.interface';
import { SyncStatePropConfig } from 'state-sync';
import { ModelIdProps } from './model/model-id-props.const';

export type SyncModelState = Partial<ModelState> & StateCurrentUser & StateLeaderSettings;

export const AppSyncStateConfig: {[key in keyof SyncModelState]: SyncStatePropConfig} = 
{
    missions: {idProp: ModelIdProps.missions, type: "array"},
    missionImages: {idProp: ModelIdProps.missionImages, type: "array"},
    missionNotes: {idProp: ModelIdProps.missionNotes, type: "array"},
    missionActivities: {idProp: ModelIdProps.missionActivities, type: "array"},
    missionDocuments: {idProp: ModelIdProps.missionDocuments, type: "array"},
    activities: {idProp: ModelIdProps.activities, type: "array"},
    employers: {idProp: ModelIdProps.employers, type: "array"},  
    userTimesheets: {idProp: ModelIdProps.userTimesheets, type: "array"}, 
    currentUser: {idProp: ModelIdProps.users, type: "value", wipeable: false},  
    leaderSettings: {idProp: "", type: "value", wipeable: false}, 
};


