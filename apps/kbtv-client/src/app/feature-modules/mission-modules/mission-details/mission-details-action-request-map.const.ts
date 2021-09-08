import { CommandIdHeader } from "@core/configurations/command-id-header.const";
import { ModelBaseUrls } from "@core/configurations/model/model-base-urls.const";
import { DeleteMissionHeaderImageRequest } from "@core/configurations/model/model-requests.interface";
import { _deleteModelRequest, _setSaveModelFileRequest, _setSaveModelRequest } from "@core/configurations/optimistic/global-action-requests";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { _createActionRequestMap, _entry } from "optimistic-http";
import { MissionDetailsActions } from "./state/actions.const";

export const MissionDetailsActionRequestMap = _createActionRequestMap(
    _setSaveModelRequest,  
    _deleteModelRequest,   
    _setSaveModelFileRequest, 
    _entry(MissionDetailsActions.deleteHeaderImage, (action) => ({ 
        method: "PUT",
        apiUrl: `${ModelBaseUrls.missions}/${action.id}/DeleteHeaderImage`,
        headers: { [CommandIdHeader]: _idGenerator(4) },
        type: DeleteMissionHeaderImageRequest
    }))
)