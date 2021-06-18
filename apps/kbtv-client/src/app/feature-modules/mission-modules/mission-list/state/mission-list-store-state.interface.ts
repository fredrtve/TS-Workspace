import { StateEmployers, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";
import { StateMissionCriteria } from "@shared-mission/interfaces";

export interface MissionListStoreState extends
    StateMissions, 
    StateEmployers,
    StateMissionTypes,
    StateMissionImages,
    StateMissionDocuments,
    StateMissionNotes,
    StateMissionCriteria {} 