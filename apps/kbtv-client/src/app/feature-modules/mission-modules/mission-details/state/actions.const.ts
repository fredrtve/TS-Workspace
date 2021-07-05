import { StateAction } from "state-management";

export const UpdateLastVisitedAction = "UPDATE_LAST_VISITED_ACTION";
export interface UpdateLastVisitedAction extends StateAction<typeof UpdateLastVisitedAction> {
    id: string
}
export const DeleteMissionHeaderImageAction = "DELETE_MISSION_HEADER_IMAGE_ACTION";
export interface DeleteMissionHeaderImageAction extends StateAction<typeof DeleteMissionHeaderImageAction> {
    id: string
}
