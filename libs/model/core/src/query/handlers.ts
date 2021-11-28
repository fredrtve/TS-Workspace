import { _convertArrayToObject, _groupBy } from "@fretve/array-helpers";
import { Immutable } from "@fretve/global-types";
import { ModelChildrenMap, ModelForeignsMap, StateModels, UnknownModelState, ValidRelationProps } from "../interfaces";
import { _getModelConfig } from "../model-state-config-helpers";
import { ModelQueryHandlerOptions, QueryIncludeFn } from "./interfaces";
import { ModelQuery } from "./model-query";
import { QueryActionHandler, QueryActionHandlerMap } from "./query-engine/interfaces";
import { QueryEngine } from "./query-engine/query.engine";

export type QueryWhereValue = (entity: Immutable<unknown>) => boolean
export type QuerySelectValue = (entity: Immutable<unknown>) => any
export type QueryIncludeValue<TState, TModel extends StateModels<TState>>  = {
    prop: ValidRelationProps<TState, TModel>,
    query: QueryIncludeFn<TState, TModel, any> | undefined, 
}

export interface ModelQueryHandlerMap<TState, TModel extends StateModels<TState>> 
    extends QueryActionHandlerMap<TModel, ModelQueryHandlerOptions<TState, TModel>> {
    where: QueryActionHandler<TModel, QueryWhereValue, any>,
    include: QueryActionHandler<TModel, QueryIncludeValue<TState, TModel>, ModelQueryHandlerOptions<TState, TModel>>,
    select: QueryActionHandler<TModel, QuerySelectValue, any>
}

export const modelQueryHandlers: ModelQueryHandlerMap<any,any> = {
    where: (exp) => (model, next) => exp(model) === true ? next(model) : null,
    include: ({prop, query}, {modelConfig, state}) => {
        
        const resolveSlice = query ? 
            (stateProp: string) => (<ModelQuery<any,any>> query(new ModelQuery(stateProp, new QueryEngine(modelQueryHandlers)))).run(state) :
            (stateProp: string) => state[stateProp];

        const childRel = (<ModelChildrenMap<UnknownModelState, any>><any> modelConfig.children)[<string> prop];

        if(childRel){    
            const childLookup = _groupBy(resolveSlice(childRel.stateProp), childRel.childKey);

            return (model, next) => { 
                model[<any> prop] = childLookup[ model[modelConfig.idProp] ]; 
                return next(model)
            } 
        }

        const fkRel = (<ModelForeignsMap<UnknownModelState, any>> modelConfig.foreigns)[<string> prop];

        if(fkRel) {
            const fkCfg = _getModelConfig<any,any>(fkRel.stateProp);    

            const fkLookup = _convertArrayToObject(resolveSlice(fkCfg.stateProp), fkCfg.idProp);

            return (model, next) => { 
                model[<any> prop] = fkLookup[ model[fkRel.foreignKey] ]; 
                return next(model)
            } 
        }  
                    
        throw new Error(`'${<string> prop}' is not configured as child or foreign relation for '${modelConfig.stateProp}'`);
    },
    select: (exp) => (model, next) => next(exp(model)),
}
