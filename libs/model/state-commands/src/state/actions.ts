
import { Immutable } from "@fretve/global-types";
import { SaveModelResult, StateModels, StatePropByModel } from "model/core";

export const ModelCommands = {
    delete: <TState, TModel extends StateModels<TState>>(payload: Immutable<DeleteModelPayload<TState, TModel>>) => 
        ({ ...payload, type: "Delete Model" }),
    save: <TState, TModel extends StateModels<TState>>(payload: Immutable<SaveModelPayload<TState, TModel>>) => 
        ({ ...payload, type: "Save Model" }),
    setSave: <TState, TModel extends StateModels<TState>>(payload: Immutable<SetSaveModelStatePayload<TState, TModel>>) => 
        ({ ...payload, type: "Set Save Model" }),
}

export interface DeleteModelPayload<TState, TModel extends StateModels<TState>> 
    extends ModelCommandPayload<TState, TModel>{
    payload: {id?: string | number, ids?: string[] | number[]}
}

export interface SaveModelPayload<TState, TModel extends StateModels<TState>> 
    extends ModelCommandPayload<TState, TModel>{
    /** Only neccesary if manually creating id for new entity */
    isNew?: boolean
    entity: TModel,
}

export interface SetSaveModelStatePayload<TState, TModel extends StateModels<TState>> 
    extends ModelCommandPayload<TState, TModel>{
    isNew: boolean  
    saveModelResult: SaveModelResult<TState, TModel>
}

export interface ModelCommandPayload<TState, TModel extends StateModels<TState>> {
    stateProp: StatePropByModel<TState, TModel>;
}