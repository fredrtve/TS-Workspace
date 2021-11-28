import { DeleteModelRequest } from "@core/configurations/model/model-requests.interface";
import { Model } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { AppModelStatePropTranslations } from "@shared-app/constants/model-state-prop-translations.const";
import { Immutable } from "@fretve/global-types";
import { _getModelConfig } from "model/core";
import { translations } from "../../constants/translations.const";

export function _deleteModelRequestDescriber(request: Immutable<DeleteModelRequest<Model>>): string {
    const modelConfig = _getModelConfig<ModelState, Model>(request.stateProp);
    const translation = AppModelStatePropTranslations[request.stateProp.toLowerCase()];           
    const idWord = translations[modelConfig.idProp.toLowerCase()] || modelConfig.idProp
    const id = request.apiUrl.split('/').pop();
    
    return `Sletting av ${translation?.singular.toLowerCase() || 'ukjent'} 
            med ${idWord.toLowerCase()} ${id}.`
}