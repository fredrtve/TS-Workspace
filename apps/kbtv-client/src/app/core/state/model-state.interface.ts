import { StateActivities, StateEmployers, StateInboundEmailPassword, StateMissionActivities, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions, StateTimesheets, StateUsers, StateUserTimesheets } from './global-state.interfaces';

export interface ModelState extends
    StateMissions, StateEmployers, StateMissionImages, StateMissionDocuments, StateMissionNotes,
    StateUserTimesheets, StateUsers, StateInboundEmailPassword, StateTimesheets, StateMissionActivities, StateActivities {
}
