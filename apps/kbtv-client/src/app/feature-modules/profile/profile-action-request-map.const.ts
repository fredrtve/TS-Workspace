import { ApiUrl } from "@core/api-url.enum";
import { CommandIdHeader } from "@core/configurations/command-id-header.const";
import { UpdateCurrentUserRequest } from "@core/configurations/model/model-requests.interface";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { _createActionRequestMap, _entry } from "optimistic-http";
import { ProfileActions } from "./state/actions.const";

export const ProfileActionRequestMap = _createActionRequestMap(
    _entry(ProfileActions.updateUser, (a): UpdateCurrentUserRequest => ({
        method: "PUT", 
        body: a.user, 
        apiUrl: ApiUrl.Auth, 
        headers: { [CommandIdHeader]: _idGenerator(4) },
        type: UpdateCurrentUserRequest   
    }))
)