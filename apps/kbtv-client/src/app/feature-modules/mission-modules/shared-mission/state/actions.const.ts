import { MissionCriteria } from "@shared/interfaces";
import { _createAction, _payload } from "state-management";

export const SharedMissionActions = {
    createMissionImages: _createAction("Create Mission Images", 
        _payload<{ files: Record<number, File>; missionId: string; }>()),
    setMissionCriteria: _createAction("Set Mission Criteria", 
        _payload<{ missionCriteria: MissionCriteria }>()),
}