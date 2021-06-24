import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { UnknownState } from "global-types";
import { DeleteModelAction, ModelCommand, SetSaveModelStateAction } from "model/state-commands";
import { ActionRequestMap } from "optimistic-http";
import { ApiUrl } from "../../api-url.enum";
import { SetSaveModelFileStateAction } from "../../global-actions";
import { Model, ModelFile } from "../../models";
import { ModelState } from "../../state/model-state.interface";
import { CommandIdHeader } from "../command-id-header.const";
import { ModelBaseUrls } from "../model/model-base-urls.const";
import { ModelIdProps } from "../model/model-id-props.const";
import { DeleteModelRangeRequest, DeleteModelRequest, SaveModelFileRequest, SaveModelRequest } from "../model/model-requests.interface";

export type GenericOptimisticActions = SetSaveModelStateAction<ModelState, Model> | SetSaveModelFileStateAction | DeleteModelAction<ModelState, Model>;

export const GenericActionRequestMap: ActionRequestMap<GenericOptimisticActions> = {
    [SetSaveModelStateAction]: (a): SaveModelRequest<Model> => { 
        const {createdAt, ...body} = a.saveModelResult.fullModel;
        return a.saveAction === ModelCommand.Create ? 
            { 
                method: "POST", stateProp: a.stateProp, body,
                apiUrl: ModelBaseUrls[a.stateProp],
                headers: { [CommandIdHeader]: _idGenerator(4) },
                type: SaveModelRequest
            } : 
            { 
                method: "PUT", stateProp: a.stateProp, body, 
                apiUrl: `${ModelBaseUrls[a.stateProp]}/${a.saveModelResult.fullModel[<keyof Model> ModelIdProps[a.stateProp]]}`,
                headers: { [CommandIdHeader]: _idGenerator(4) },
                type: SaveModelRequest
            }
    },
    [SetSaveModelFileStateAction]: (a): SaveModelFileRequest<ModelFile> => { 
        const isCreate = a.saveAction === ModelCommand.Create;

        const {fileName, createdAt, ...entity} = a.saveModelResult.fullModel;
        
        const apiUrl = a.stateProp === "missions" ? 
            `${ApiUrl.Mission}/${entity.id}/UpdateHeaderImage` :
            ModelBaseUrls[a.stateProp] + (isCreate ? '' : `/${(<UnknownState> entity)[ModelIdProps[a.stateProp]]}`);

        const headers =  { [CommandIdHeader]: _idGenerator(4) };

        return {
            method: isCreate ? "POST" : "PUT", 
            contentType: "formData",
            body: { ...entity, file: a.file },
            stateProp: <never> a.stateProp, 
            apiUrl,
            headers,
            type: SaveModelFileRequest
        }
    },   
    [DeleteModelAction]: (a): DeleteModelRequest<Model> | DeleteModelRangeRequest<Model> => { 
        return a.payload.id ? 
            { 
                method: "DELETE", stateProp: a.stateProp,
                apiUrl: `${ModelBaseUrls[a.stateProp]}/${a.payload.id}`,
                headers: { [CommandIdHeader]: _idGenerator(4) },
                type: DeleteModelRequest
            } :
            { 
                method: "POST", stateProp: a.stateProp,
                apiUrl: `${ModelBaseUrls[a.stateProp]}/DeleteRange`, 
                body: {ids: a.payload.ids || []},
                headers: { [CommandIdHeader]: _idGenerator(4) },
                type: DeleteModelRangeRequest
            }  
    }
}