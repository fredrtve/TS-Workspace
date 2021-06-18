import { MissionCriteria } from "@shared/interfaces";
import { StateAction } from "state-management";

export const CreateMissionImagesAction = "CREATE_MISSION_IMAGES_ACTION";
export interface CreateMissionImagesAction extends StateAction<typeof CreateMissionImagesAction> {
    files: Record<number, File>;
    missionId: string;
}

export const SetMissionCriteriaAction = "SET_MISSION_CRITERIA_ACTION";
export interface SetMissionCriteriaAction extends StateAction<typeof SetMissionCriteriaAction> {
    missionCriteria: MissionCriteria
}