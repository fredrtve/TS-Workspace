import { _saveModel } from "model/core";
import { map } from "rxjs/operators";
import { DispatchedActions, Effect, listenTo } from "state-management";
import { ModelCommands } from "./actions";

export class SaveModelEffect implements Effect {

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([ModelCommands.save]),
            map(({stateSnapshot, action}) => {
                const saveModelResult = _saveModel<any,any>(stateSnapshot, action.stateProp, action.entity);
                return ModelCommands.setSave({
                    saveModelResult,
                    stateProp: action.stateProp,
                    saveAction: action.saveAction
                })
            })
        )
    }
  
}