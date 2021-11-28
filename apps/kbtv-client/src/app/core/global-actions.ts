import { ModelFile } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { Immutable } from "@fretve/global-types";
import { StateModels } from "model/core";
import { DeleteModelPayload, ModelCommandPayload, ModelCommands, SaveModelPayload, SetSaveModelStatePayload } from "model/state-commands";
import { _createAction, _payload } from "state-management";

export const GlobalActions = {
        wipeState: _createAction("Wipe State", _payload<{ defaultState: {} }>()),
        saveModelFile: <TModel extends ModelFile = ModelFile>(payload: Immutable<SaveModelFilePayload<TModel>>) => 
                ({ ...payload, type: "Save Model File Action" }),
        setSaveModelFile: <TModel extends ModelFile = ModelFile>(payload: Immutable<SetSaveModelFileStatePayload<TModel>>) => 
                ({ ...payload, type: "Set Save Model File Action" }),
        mailModels: <TModel extends StateModels<ModelState>>(payload: Immutable<MailModelsPayload<TModel>>) => 
                ({ ...payload, type: "Mail Model Action" }),
        saveModel: <TModel extends StateModels<ModelState>>(payload: Immutable<SaveModelPayload<ModelState, TModel>>) => 
                ModelCommands.save<ModelState, TModel>(payload),
        setSaveModel: <TModel extends StateModels<ModelState>>(payload: Immutable<SetSaveModelStatePayload<ModelState, TModel>>) => 
                ModelCommands.setSave<ModelState, TModel>(payload),
        deleteModel: <TModel extends StateModels<ModelState>>(payload: Immutable<DeleteModelPayload<ModelState, TModel>>) => 
                ModelCommands.delete<ModelState, TModel>(payload),
}

export interface SaveModelFilePayload<TModel extends ModelFile = ModelFile> extends SaveModelPayload<ModelState, TModel>{
        file: File, 
}

export interface SetSaveModelFileStatePayload<TModel extends ModelFile = ModelFile> extends SetSaveModelStatePayload<ModelState, TModel>{
        file: File, 
}

export interface MailModelsPayload<TModel extends StateModels<ModelState>> 
    extends ModelCommandPayload<ModelState, TModel> {
    ids: unknown[],
    toEmail: string
}