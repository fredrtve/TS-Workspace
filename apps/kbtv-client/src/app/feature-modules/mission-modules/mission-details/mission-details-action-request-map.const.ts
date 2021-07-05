import { CommandIdHeader } from "@core/configurations/command-id-header.const";
import { ModelBaseUrls } from "@core/configurations/model/model-base-urls.const";
import { DeleteMissionHeaderImageRequest } from "@core/configurations/model/model-requests.interface";
import { GenericActionRequestMap } from "@core/configurations/optimistic/generic-action-request-map.const";
import { SetSaveModelFileStateAction } from "@core/global-actions";
import { Model } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { DeleteModelAction, SetSaveModelStateAction } from "model/state-commands";
import { ActionRequestMap } from "optimistic-http";
import { DeleteMissionHeaderImageAction } from "./state/actions.const";

export type MissionDetailsOptimisticActions = DeleteMissionHeaderImageAction | 
    SetSaveModelStateAction<ModelState, Model> | SetSaveModelFileStateAction | DeleteModelAction<ModelState, Model>;

export const MissionDetailsActionRequestMap: ActionRequestMap<MissionDetailsOptimisticActions> = {
    [SetSaveModelStateAction]: GenericActionRequestMap[SetSaveModelStateAction],  
    [DeleteModelAction]: GenericActionRequestMap[DeleteModelAction],   
    [SetSaveModelFileStateAction]: GenericActionRequestMap[SetSaveModelFileStateAction], 
    [DeleteMissionHeaderImageAction]: (action) => { return  { 
        method: "PUT",
        apiUrl: `${ModelBaseUrls.missions}/${action.id}/DeleteHeaderImage`,
        headers: { [CommandIdHeader]: _idGenerator(4) },
        type: DeleteMissionHeaderImageRequest
    } }
}