import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { UnknownState } from "global-types";
import { _entry } from "optimistic-http";
import { ApiUrl } from "../../api-url.enum";
import { GlobalActions } from "../../global-actions";
import { Model } from "../../models";
import { CommandIdHeader } from "../command-id-header.const";
import { ModelBaseUrls } from "../model/model-base-urls.const";
import { ModelIdProps } from "../model/model-id-props.const";
import { DeleteModelRangeRequest, DeleteModelRequest, SaveModelFileRequest, SaveModelRequest } from "../model/model-requests.interface";

export const _setSaveModelRequest = _entry(GlobalActions.setSaveModel, (a) => { 
    const {createdAt, ...body} = a.saveModelResult.fullModel;
    return a.isNew ? 
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
});
 
export const _setSaveModelFileRequest = _entry(GlobalActions.setSaveModelFile, (a) => {
    const {fileName, createdAt, ...entity} = a.saveModelResult.fullModel;
    
    const apiUrl = a.stateProp === "missions" ? 
        `${ApiUrl.Mission}/${entity.id}/UpdateHeaderImage` :
        ModelBaseUrls[a.stateProp] + (a.isNew  ? '' : `/${(<UnknownState> entity)[ModelIdProps[a.stateProp]]}`);

    const headers =  { [CommandIdHeader]: _idGenerator(4) };

    return {
        method: a.isNew ? "POST" : "PUT", 
        contentType: "formData",
        body: { ...entity, file: a.file },
        stateProp: a.stateProp, 
        apiUrl,
        headers,
        type: SaveModelFileRequest
    }
});

export const _deleteModelRequest = _entry(GlobalActions.deleteModel, (a) =>
    a.payload.id 
    ? { 
        method: "DELETE", stateProp: a.stateProp,
        apiUrl: `${ModelBaseUrls[a.stateProp]}/${a.payload.id}`,
        headers: { [CommandIdHeader]: _idGenerator(4) },
        type: DeleteModelRequest
    } 
    : { 
        method: "POST", stateProp: a.stateProp,
        apiUrl: `${ModelBaseUrls[a.stateProp]}/DeleteRange`, 
        body: {ids: a.payload.ids || []},
        headers: { [CommandIdHeader]: _idGenerator(4) },
        type: DeleteModelRangeRequest
    } 
);