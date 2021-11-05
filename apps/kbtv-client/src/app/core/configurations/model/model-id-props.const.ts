import { ValidModelIdKey, ValidStateModelArray } from "model/core";
import { ModelState } from "../../state/model-state.interface";

export const ModelIdProps: {[key in keyof ModelState]: ModelState[key] extends ValidStateModelArray<(infer M)> ? ValidModelIdKey<M> : never } = {
    missions: "id",
    employers: 'id',
    missionDocuments: 'id',
    missionImages: 'id',
    missionNotes: 'id',
    timesheets: 'id',
    userTimesheets: 'id',
    inboundEmailPasswords: 'id',
    missionActivities: 'id',
    activities: 'id',
    users: 'userName',    
}