import { CreateUserRequest, DeleteMissionHeaderImageRequest, DeleteModelRangeRequest, DeleteModelRequest, SaveModelFileRequest, SaveModelRequest, UpdateCurrentUserRequest, UpdateTimesheetStatusesRequest } from "@core/configurations/model/model-requests.interface";
import { Model, ModelFile } from "@core/models";
import { StateMissions } from "@core/state/global-state.interfaces";
import { _deleteModelRangeRequestDescriber } from "@shared-app/helpers/request-describers/delete-model-range-request-describer.helper";
import { _deleteModelRequestDescriber } from "@shared-app/helpers/request-describers/delete-model-request-describer.helper";
import { _saveModelRequestDescriber } from "@shared-app/helpers/request-describers/save-model-request-describer.helper";
import { RequestDescriberMap } from "@shared-app/interfaces/request-describer-map.interface";
import { _find } from "array-helpers";

type Requests = SaveModelRequest<Model> | SaveModelFileRequest<ModelFile> | DeleteModelRangeRequest<Model> | DeleteModelRequest<Model> |
    UpdateTimesheetStatusesRequest | CreateUserRequest | UpdateCurrentUserRequest | DeleteMissionHeaderImageRequest;

export const AppRequestDescriberMap: RequestDescriberMap<Requests, StateMissions> = {
    SaveModelRequest: _saveModelRequestDescriber,
    SaveModelFileRequest: _saveModelRequestDescriber,
    DeleteModelRequest: _deleteModelRequestDescriber,
    DeleteModelRangeRequest: _deleteModelRangeRequestDescriber,
    CreateUserRequest: (req, state) => _saveModelRequestDescriber({...req, stateProp: "users"}, state),
    UpdateTimesheetStatusesRequest: (req) => `Oppdatering status for ${req.body.ids.length} timeregistreringer`,
    UpdateCurrentUserRequest: (req) => "Oppdatering av profil",
    DeleteMissionHeaderImageRequest: (req, state) => {
        const urlFragments = req.apiUrl.split('/');
        const mission = _find(state.missions, urlFragments[urlFragments.length - 2], "id");
        return `Sletting av banner bilde på oppdrag '${mission?.address}'`
    }
}