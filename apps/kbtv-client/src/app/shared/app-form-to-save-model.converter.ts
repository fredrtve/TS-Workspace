import { GlobalActions } from "@core/global-actions";
import { Model } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { Immutable, UnknownState } from "global-types";
import { StateModels, _getModelConfig } from "model/core";
import { ModelFormResult } from "model/form";

export function _appFormToSaveModelConverter<TModel extends StateModels<ModelState> & Model>(
    input: Immutable<ModelFormResult<ModelState, TModel>>
) {
    const idProp = _getModelConfig<ModelState, TModel>(input.stateProp).idProp;
    return GlobalActions.saveModel({
        stateProp: input.stateProp,
        entity: (<UnknownState> input.formValue)[idProp] != null ? 
            input.formValue : 
            {...input.formValue, createdAt: new Date().getTime() }    
    })
}