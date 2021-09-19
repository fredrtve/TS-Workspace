import { CommandIdHeader } from "@core/configurations/command-id-header.const";
import { CreateUserRequest, SaveModelRequest, UpdateModelRequest } from "@core/configurations/model/model-requests.interface";
import { _deleteModelRequest, _setSaveModelRequest } from "@core/configurations/optimistic/global-action-requests";
import { User } from "@core/models";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { _createActionRequestMap, _entry } from "optimistic-http";
import { CurrentUser } from "state-auth";
import { UserActions } from "./state/actions.const";

export const UserActionRequestMap = _createActionRequestMap(
    _deleteModelRequest,
    _entry(UserActions.setSaveUser, (action): CreateUserRequest | UpdateModelRequest<User & CurrentUser> => {
        const request = <CreateUserRequest | UpdateModelRequest<User & CurrentUser>> 
            (<any> _setSaveModelRequest).converter({...action, stateProp: "users"});

        if(action.isNew){
            let {employer, createdAt, ...rest} = action.saveModelResult.fullModel
            request.body = {...rest, password: action.password};
            request.type = CreateUserRequest;
        }
        else request.type = SaveModelRequest;

        request.headers = { [CommandIdHeader]: _idGenerator(4) }
        
        return request;
    }),
)