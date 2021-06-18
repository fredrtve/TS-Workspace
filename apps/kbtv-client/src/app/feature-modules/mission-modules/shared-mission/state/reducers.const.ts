import { StateMissionCriteria } from "../interfaces"
import { _createReducer } from "state-management"
import { SetMissionCriteriaAction } from "./actions.const"

export const SetMissionCriteriaReducer = _createReducer<StateMissionCriteria, SetMissionCriteriaAction>(
    SetMissionCriteriaAction, (state, action) => {
        return { missionCriteria: action.missionCriteria }
    }       
)  
