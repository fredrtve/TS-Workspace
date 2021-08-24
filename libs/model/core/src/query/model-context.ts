import { _getModelConfig } from "../model-state-config-helpers";
import { ModelByStateProp, StateModels } from "../interfaces";
import { modelQueryHandlers } from "./handlers";
import { ModelQuery } from "./model-query";
import { QueryEngine } from "./query-engine/query.engine";
import { Immutable } from "global-types";

export class ModelContext<TState> {
    /**
     * Query for a model in TState
     * @param stateProp - Model state property
     * @returns A model query object
     */
    get<TProp extends keyof TState>(
        stateProp: TProp
    ):  ModelByStateProp<TState, TProp> extends StateModels<TState> ? 
        ModelQuery<TState, ModelByStateProp<TState, TProp>> : any {
        return <any> new ModelQuery<TState, any>(<any> stateProp, new QueryEngine(modelQueryHandlers))
    }

    /**
     * Get display value for model
     * @param stateProp - Model state property
     * @param value - Model value
     */
    getDisplayValue<TProp extends keyof TState>(
        stateProp: TProp, 
        value: Immutable<Partial<ModelByStateProp<TState, TProp>>>
    ): string | undefined {
        const fkPropModelMap = _getModelConfig<TState, any>(<any> stateProp);
        return fkPropModelMap?.displayFn ? fkPropModelMap.displayFn(value) : undefined;
    }
}