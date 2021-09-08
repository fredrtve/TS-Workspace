import { _createAction, _payload } from "state-management";

export const MissionDetailsActions = {
    updateLastVisited: _createAction("Update Mission Last Visited", _payload<{ id: string }>()),
    deleteHeaderImage: _createAction("Delete Mission Header Image", _payload<{ id: string }>())
}
