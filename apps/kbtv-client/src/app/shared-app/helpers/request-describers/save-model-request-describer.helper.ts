import { SaveModelRequest } from "@core/configurations/model/model-requests.interface";
import { Model } from "@core/models";
import { StateMissions } from "@core/state/global-state.interfaces";
import { ModelState } from "@core/state/model-state.interface";
import { AppModelStatePropTranslations } from "@shared-app/constants/model-state-prop-translations.const";
import { _find } from "@fretve/array-helpers";
import { Immutable, Prop, UnknownState } from "@fretve/global-types";
import { ForeignRelation, _getModelConfig } from "model/core";
import { translations } from "../../constants/translations.const";

type Request = Immutable<Omit<SaveModelRequest<Model>, "type" | "contentType">>;

export function _saveModelRequestDescriber(request: Request, state: Immutable<StateMissions>): string {

    const modelConfig = _getModelConfig<ModelState, Model>(request.stateProp);
    const saveWord = request.method === "PUT" ? "Oppdatering" : "Oppretting";
    const entityWord = AppModelStatePropTranslations[<string> request.stateProp.toLowerCase()]?.singular.toLowerCase();

    const displayValue = modelConfig.displayFn?.(request.body);
    
    let description: string;

    if(displayValue)
        description = `${saveWord} av ${entityWord} '${displayValue}'`;
    else{
        const idPropValue = request.body[<Prop<Immutable<Model>>> modelConfig.idProp];
        const idWord = translations[modelConfig.idProp.toLowerCase()] || modelConfig.idProp;
        description = `${saveWord} av ${entityWord} med ${idWord.toLowerCase()} '${idPropValue}'`;
    }

    for(const fk in modelConfig.foreigns){ 
        const fkRel = (<{[key: string]: ForeignRelation<StateMissions,any,any>}> modelConfig.foreigns)[fk];
        if(fkRel.stateProp === "missions") 
            description = description + appendMissionChildDescription(request, state, fkRel)
    }

    return description;
}

function appendMissionChildDescription(request: Request, state: Immutable<StateMissions>, fkRel: ForeignRelation<StateMissions,any,any>): string{
    const fkId = (<UnknownState> request.body)[fkRel.foreignKey];
    const mission = _find(state.missions, fkId, "id");
    if(!mission) return "";
    return ` på oppdrag '${mission.address}'`;
}