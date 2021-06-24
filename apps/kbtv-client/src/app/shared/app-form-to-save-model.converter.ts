import { Model } from "@core/models";
import { Immutable } from "global-types";
import { StateModels } from "model/core";
import { ModelFormResult } from "model/form";
import { ModelCommand, SaveModelAction } from "model/state-commands";

export function _appFormToSaveModelConverter<TState extends object, TModel extends StateModels<TState> & Model>(
    input: Immutable<ModelFormResult<TState, TModel>>
): Immutable<SaveModelAction<TState, TModel>> {
    input.formValue
    return {
        type: SaveModelAction,
        saveAction: input.saveAction,
        stateProp: input.stateProp,
        entity: input.saveAction !== ModelCommand.Create ? 
            input.formValue : 
            {...input.formValue, createdAt: new Date().getTime() }    
    }
}