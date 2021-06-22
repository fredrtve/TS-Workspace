import { StateEmployers, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";

export interface MissionDetailsStoreState extends
    StateMissions, 
    StateEmployers,
    StateMissionTypes,
    StateMissionImages,
    StateMissionDocuments,
    StateMissionNotes {} 