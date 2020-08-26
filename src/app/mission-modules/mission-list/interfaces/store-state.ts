import { StateEmployers, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions, StateMissionTypes } from 'src/app/core/state';
import { MissionFilterCriteria } from '../interfaces/mission-filter-criteria.interface';

export interface StoreState extends 
    StateMissions, 
    StateEmployers,
    StateMissionTypes,
    StateMissionImages,
    StateMissionDocuments,
    StateMissionNotes {
    missionSortByDate: "lastVisited" | "updatedAt";
    missionCriteria: MissionFilterCriteria;
} 