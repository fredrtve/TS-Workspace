import { GlobalActions } from "@core/global-actions";
import { Model } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { _googleAddressFormatter } from "@shared-app/helpers/google-address-formatter.helper";
import { _isAddressEntity } from "@shared-app/helpers/is-address-entity.helper";
import { Immutable, UnknownState } from "global-types";
import { StateModels, _getModelConfig } from "model/core";
import { ModelFormResult } from "model/form";

export function _appFormToSaveModelConverter<TModel extends StateModels<ModelState> & Model>(
    input: Immutable<ModelFormResult<ModelState, TModel>>
) {
    const idProp = _getModelConfig<ModelState, TModel>(input.stateProp).idProp;
    let formValue = input.formValue;

    if(_isAddressEntity(formValue)) 
        formValue = _googleAddressFormatter(formValue)

    return GlobalActions.saveModel({
        stateProp: input.stateProp,
        entity: (<UnknownState> formValue)[idProp] != null ? 
            formValue : 
            {...formValue, createdAt: new Date().getTime() }    
    })
}