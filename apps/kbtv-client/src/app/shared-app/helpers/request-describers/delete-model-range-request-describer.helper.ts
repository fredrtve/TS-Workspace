import { DeleteModelRangeRequest } from "@core/configurations/model/model-requests.interface";
import { Model } from "@core/models";
import { ModelState } from "@core/state/model-state.interface";
import { AppModelStatePropTranslations } from "@shared-app/constants/model-state-prop-translations.const";
import { Immutable } from "@fretve/global-types";
import { _getModelConfig } from "model/core";
import { translations } from "../../constants/translations.const";

export function _deleteModelRangeRequestDescriber(request: Immutable<DeleteModelRangeRequest<Model>>): string {
    const modelConfig = _getModelConfig<ModelState, Model>(request.stateProp);
    const payload = request.body;
    const translation = AppModelStatePropTranslations[request.stateProp.toLowerCase()];  
    const idWord = translations[modelConfig.idProp.toLowerCase()] || modelConfig.idProp

    return `Sletting av ${payload.ids?.length || 0} ${translation?.plural.toLowerCase() || 'ukjent'} 
            med ${idWord.toLowerCase()} ${payload.ids}.`
}