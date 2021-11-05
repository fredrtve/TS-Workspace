import { StateEmployers, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions } from "@core/state/global-state.interfaces";

export interface MissionDetailsStoreState extends
    StateMissions, 
    StateEmployers,
    StateMissionImages,
    StateMissionDocuments,
    StateMissionNotes {} 