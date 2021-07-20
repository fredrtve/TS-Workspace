import { _convertArrayToObject, _filter, _groupBy } from 'array-helpers';
import { _weakMemoizer }  from "global-utils";
import { Immutable, ImmutableArray, UnknownState } from 'global-types';
import { ModelConfig, RelationInclude, StateModels } from '../interfaces';
import { _getModelConfig } from '../model-state-config-helpers';

/**
 * Get all or given range of models with specified relationships set on model
 * according to model property config {@link ModelConfig}
 * @param state - State containing model and relationship data
 * @param cfg - Configuration of which relationships to include
 * @param filter - A filter to select a range of models. 
 * @returns An array of models with relationships applied. 
 */
export const _getModels = _weakMemoizer(getModels);

function getModels<TState, TModel extends StateModels<TState>>(
    state: Immutable<Partial<TState>>,
    include: Immutable<RelationInclude<TState, TModel>>,
    filter?: (value: Immutable<TModel>, index?: number, Array?: unknown[]) => boolean, 
): Immutable<TModel>[] {
    const modelCfg = _getModelConfig(include.prop); 

    let modelState = (<Record<string, Immutable<TModel[]>>> state)[<string> include.prop];
    if(!modelState || modelState.length === 0) return [];

    if(filter)
        modelState = _filter(modelState, filter);

    if(modelState.length === 0) return [];

    const fkProps =  <string[]> (include.foreigns === "all" ? Object.keys(modelCfg.foreigns) : include.foreigns);
    let foreignLookups = fkProps?.length ? 
        _createForeignModelIdLookups(fkProps, state, modelCfg) : {};

    const childProps = <string[]> (include.children === "all" ? Object.keys(modelCfg.children) : include.children);
    let childLookups = childProps?.length ? 
        _createGroupedChildLookups(childProps, state, modelCfg) : {};
    
    if(!childProps?.length && !fkProps?.length) return <Immutable<TModel>[]> modelState; 
    
    const newState: unknown[] = [];

    for(var i = 0; i < modelState.length; i++){
        let entityClone = { ...<UnknownState>modelState[i] };                   
        if(fkProps?.length) _mapForeignsToEntity(fkProps, foreignLookups, entityClone, modelCfg);        
        if(childProps?.length) _mapChildrenToEntity(childProps, childLookups, entityClone, modelCfg);
        newState[i] = entityClone;
    }

    return <Immutable<TModel>[]> newState       
}

/** Lookup of children grouped by foreign key */
function _createGroupedChildLookups(
    props: ImmutableArray<string>, 
    state: Immutable<object>,
    modelCfg: Immutable<ModelConfig<any,any>>
): {[key: string]: {[key: string]: unknown[]}}{
    const lookups = {} as {[key: string]: {[key: string]: unknown[]}}
    
    for(const prop of props) {
        const chRel = modelCfg.children[prop];
        lookups[prop] = _groupBy(<[]>(<UnknownState> state)[chRel.stateProp], chRel.childKey);
    }
        
    return lookups;
}

/** Lookup of foreign entities by idProp */
function _createForeignModelIdLookups(
    props: ImmutableArray<string>, 
    state: Immutable<{}>,
    modelCfg: Immutable<ModelConfig<any,any>>
): {[key: string]: Immutable<UnknownState>} {
    const lookups: {[key: string]: Immutable<UnknownState>} = {};
    for(const prop of props){ //Convert foreign state props to lookup tables
        const fkRel = modelCfg.foreigns[prop];
        const cfg = _getModelConfig<any, any>(fkRel.stateProp); 
        lookups[prop] = _convertArrayToObject(<[]> (<UnknownState> state)[fkRel.stateProp], cfg.idProp);
    }
    return lookups;
}

function _mapForeignsToEntity(
    props: ImmutableArray<string>, 
    lookups: {[key: string]: Immutable<UnknownState>}, 
    model: UnknownState,
    modelCfg: Immutable<ModelConfig<any, any>>
  ): void {
    for(const foreignProp of props){ //Map foreign entity to entity
        const fkRel = modelCfg.foreigns[foreignProp];
        model[foreignProp] = lookups[foreignProp][<string> model[fkRel.foreignKey]]
    }
}

function _mapChildrenToEntity(
    props: ImmutableArray<string>, 
    lookups: {[key: string]: Immutable<UnknownState>}, 
    model: UnknownState, 
    modelCfg: Immutable<ModelConfig<any, any>>
): void{
    const modelId = model[modelCfg.idProp];
    for(let childProp of props)    
        model[childProp] = lookups[childProp][<string> modelId]    
}