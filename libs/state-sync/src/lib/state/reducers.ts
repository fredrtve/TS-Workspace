import { _addOrUpdateRange, _removeRangeById } from "array-helpers";
import { Immutable, ImmutableArray, UnknownState } from "global-types";
import { _createReducers, _on } from "state-management";
import { SyncStatePropConfig } from "../interfaces";
import { StoreState } from "../store-state.interface";
import { SyncActions } from "./actions";

export const SyncReducers = _createReducers<StoreState>(
    _on(SyncActions.updateConfig, (state, action) => ({syncConfig: {...state.syncConfig, ...action.syncConfig} })),
    _on(SyncActions.wipeState, (state, action) => {
        const deleteState: UnknownState = {syncTimestamp: null};

        for(const prop in action.syncStateConfig){
            const propCfg = action.syncStateConfig[prop];
            if(propCfg.wipeable !== false) deleteState[prop] = undefined;     
        }

        return deleteState;
    }),
    _on(SyncActions.syncSuccess, (state, action) => {
        const newState: UnknownState = {syncTimestamp: action.response.timestamp};
        
        for(const prop in action.response.arrays){
            if(!action.response.arrays[prop]) continue;
            const propCfg: SyncStatePropConfig = action.syncStateConfig[prop]; 
            if(!propCfg) console.error(`No sync state config for property ${prop}`);      
            const {deletedEntities, entities} = action.response.arrays[prop];
            const stateSlice = <ImmutableArray<UnknownState>> (<Immutable<UnknownState>>state)[prop];

            if(deletedEntities?.length)
                newState[prop] = 
                    _removeRangeById(stateSlice, deletedEntities, propCfg.idProp);

            if(entities?.length)
                newState[prop] = 
                    _addOrUpdateRange(<ImmutableArray<UnknownState>> newState[prop] || stateSlice, entities, propCfg.idProp); 
        }

        for(const prop in action.response.values){
            if(!action.syncStateConfig[prop]) console.error(`No sync state config for property ${prop}`);
            const value = action.response.values[prop];
            if(value) newState[prop] = value;
        }

        return newState;
    })
)
