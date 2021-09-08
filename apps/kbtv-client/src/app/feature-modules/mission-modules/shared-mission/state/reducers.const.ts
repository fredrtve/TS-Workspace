import { _on } from "state-management"
import { SharedMissionActions } from "./actions.const"

export const SetMissionCriteriaReducer = _on(
    SharedMissionActions.setMissionCriteria, 
    (state, action) => ({ missionCriteria: action.missionCriteria })      
)  
