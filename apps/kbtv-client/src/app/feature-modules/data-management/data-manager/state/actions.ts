import { GlobalActions } from "@core/global-actions"
import { ModelState } from "@core/state/model-state.interface"
import { Prop } from "@fretve/global-types"
import { _createAction, _payload } from "state-management"

export const DataManagerActions = {
    deleteModel: GlobalActions.deleteModel,
}

export const DataManagerLocalActions = {
    updateSelectedProperty: _createAction("Update Selected Property", _payload<{ selectedProperty: Prop<ModelState> }>()),
}