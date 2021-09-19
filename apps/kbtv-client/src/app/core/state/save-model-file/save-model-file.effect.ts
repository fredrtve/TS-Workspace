import { GlobalActions } from "@core/global-actions";
import { _getModelConfig, _saveModel } from "model/core";
import { map } from "rxjs/operators";
import { DispatchedActions, Effect, listenTo } from "state-management";
import { ModelFile } from "../../models";
import { ModelState } from "../model-state.interface";

export class SaveModelFileEffect implements Effect {

    handle$(actions$: DispatchedActions<ModelState>) {
        return actions$.pipe(
            listenTo([GlobalActions.saveModelFile]),
            map(({stateSnapshot, action}) => {

                const modelCfg = _getModelConfig<ModelState, ModelFile>(action.stateProp);
                const preGenIds: Record<string, boolean> = {}

                let entity = <ModelFile> {...action.entity};
                let isNew = false;

                if(!action.entity[modelCfg.idProp]){
                    const newId = modelCfg.idGenerator!();
                    entity[modelCfg.idProp] = <undefined> newId;
                    preGenIds[<string> newId] = true;
                    isNew = true;
                }

                entity.fileName = URL.createObjectURL(action.file);

                const saveModelResult = _saveModel<ModelState, ModelFile>(
                    stateSnapshot, 
                    action.stateProp, 
                    entity, 
                    {[action.stateProp]: preGenIds}
                );

                return GlobalActions.setSaveModelFile({
                    saveModelResult, isNew,
                    stateProp: action.stateProp,
                    file: action.file
                })
            })
        )
    }
   
}