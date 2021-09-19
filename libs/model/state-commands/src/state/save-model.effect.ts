import { UnknownState } from "global-types";
import { _getModelConfig, _saveModel } from "model/core";
import { map } from "rxjs/operators";
import { DispatchedActions, Effect, listenTo } from "state-management";
import { ModelCommands } from "./actions";

export class SaveModelEffect implements Effect {

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([ModelCommands.save]),
            map(({stateSnapshot, action}) => {
                const saveModelResult = _saveModel<any,any>(stateSnapshot, action.stateProp, action.entity);
                const idProp = _getModelConfig(action.stateProp).idProp;
                return ModelCommands.setSave({
                    saveModelResult,
                    stateProp: action.stateProp,
                    isNew: !(<UnknownState> action.entity)[idProp] || action.isNew === true
                })
            })
        )
    }
  
}