import { ModelFileWrapper } from 'state-model';
import { StateAction } from 'state-management'

export const CreateMissionImagesAction = "CREATE_MISSION_IMAGES_ACTION";
export interface CreateMissionImagesAction extends StateAction {
    fileWrappers: ModelFileWrapper[],
    missionId: string
}