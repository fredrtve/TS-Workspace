import { StateEmployers, StateInboundEmailPassword, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions, StateMissionTypes, StateTimesheets, StateUsers, StateUserTimesheets } from './global-state.interfaces';

export interface ModelState extends
    StateMissions, StateEmployers, StateMissionTypes, StateMissionImages, StateMissionDocuments, StateMissionNotes,
    StateUserTimesheets, StateUsers, StateInboundEmailPassword, StateTimesheets {
}

