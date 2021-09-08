import { GlobalActions } from "@core/global-actions";
import { Model } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { Immutable } from "global-types";
import { StateModels } from "model/core";
import { ModelFormResult } from "model/form";
import { ModelCommand } from "model/state-commands";

export function _appFormToSaveModelConverter<TModel extends StateModels<ModelState> & Model>(
    input: Immutable<ModelFormResult<ModelState, TModel>>
) {
    return GlobalActions.saveModel({
        saveAction: input.saveAction,
        stateProp: input.stateProp,
        entity: input.saveAction !== ModelCommand.Create ? 
            input.formValue : 
            {...input.formValue, createdAt: new Date().getTime() }    
    })
}