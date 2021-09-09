import { _addOrUpdate, _convertArrayToObject } from 'array-helpers';
import { Immutable, ImmutableArray, UnknownState } from 'global-types';
import { ChildRelation, ExtractedModelState, ForeignRelation, ModelConfig, SaveModelResult, StateModels, StatePropByModel } from '../interfaces';
import { _getModelConfig } from '../model-state-config-helpers';

type ModelState = {[key: string]: object[]};

/**
 * Add or update a model and any foreign relationships set on the provided model value 
 * according to {@link ModelConfig}
 * @param state - State containing model and foregin data
 * @param stateProp - Model state property of the model
 * @param entity - The model value with optional foreign props
 * @param preGenIds - A map of pre generated ids for each state. Can be used to optimize if ids need to be generated before calling function. 
 * @returns State with model and foreigns added or updated. 
 */
export function _saveModel<TState, TModel extends StateModels<TState>>(
    state: Immutable<TState>, 
    rootStateProp: Immutable<StatePropByModel<TState,TModel>>, 
    rootModel: Immutable<TModel>, 
    preGenIds: Partial<Record<keyof TState, Record<string, boolean>>> = {}
): Immutable<SaveModelResult<TState, TModel>> {

    const modelCfg = _getModelConfig(rootStateProp);
    
    const modelId = <string> (<any> rootModel)[modelCfg.idProp];
       
    const newState: ExtractedModelState<any> = {};
    
    const relOutput = _fixModel(<any> modelCfg, <UnknownState> rootModel, modelId, newState, preGenIds);

    newState[<string> rootStateProp] = modelId ? 
        {withExistingId: [relOutput.flatModel], withGeneratedId: []} :
        {withExistingId: [], withGeneratedId: [relOutput.flatModel]};
 
    const modifiedState: ModelState = _mergeWithNewStateCache(<Immutable<ModelState>> state, newState);

    return { 
        flatModels: <Immutable<ExtractedModelState<TState>>> newState,
        fullModel: <Immutable<TModel>> relOutput.fullModel,
        modifiedState: <Immutable<Partial<TState>>> modifiedState
    };
}

function _fixModel(
    modelCfg: Immutable<ModelConfig<any,any>>,
    model: Immutable<UnknownState>,
    modelId: unknown,
    newState: ExtractedModelState<any>,
    preGenIds: Partial<Record<string, Record<string, boolean>>>
): {flatModel: UnknownState, fullModel: UnknownState} {

    if(!modelId && !modelCfg.idGenerator) 
        throw Error(`Failed to save model. Model '${modelCfg.stateProp}' requires an id set or a idGenerator.`)
  
    const fullModelClone = {...(<any> model)};
    const nullProps: {[key: string]: null} = {};
    
    if(!modelId)
        fullModelClone[modelCfg.idProp] = modelCfg.idGenerator!();

    for(var fkModelProp in modelCfg.foreigns){    
        const foreignModel = <Immutable<UnknownState>> model[fkModelProp];
        if(!foreignModel) continue; //If no foreign, continue

        const fkRel = <ForeignRelation<any,any,any>> modelCfg.foreigns[fkModelProp];

        fullModelClone[fkModelProp] =
            _addForeignRelation(fkRel, fullModelClone, foreignModel, newState, preGenIds);

        nullProps[fkModelProp] = null; //Remove foreign entity to prevent duplicate data       
    }

    for(var childModelProp in modelCfg.children){     
        const childModels = <ImmutableArray<UnknownState>> (<UnknownState> model)[childModelProp];
        if(!childModels?.length) continue; //If no children, continue

        const childRel = <ChildRelation<any,any,any>> modelCfg.children[childModelProp];  

        fullModelClone[childModelProp] = 
            _addChildrenRelations(childRel, fullModelClone[modelCfg.idProp], childModels, newState, preGenIds)

        nullProps[childModelProp] = null; //Remove child entities from model to prevent duplicate data        
    }
   
    return {flatModel: {...fullModelClone, ...nullProps}, fullModel: fullModelClone};
}

function _addChildrenRelations(
    rel: ChildRelation<any,any,any>, 
    foreignKey: unknown,
    childModels: ImmutableArray<UnknownState>,
    newState: ExtractedModelState<any>,
    preGeneratedIds: Partial<Record<string, Record<string, boolean>>>): UnknownState[] {
    const childModelCfg = _getModelConfig<any, any>(rel.stateProp); //Key information about foreign model 
    const childSlice = newState[rel.stateProp] || {withGeneratedId: [], withExistingId: []}; 
    const fullChildren = [];
    const preGenIds = preGeneratedIds[rel.stateProp] || {};
    for(const childModel of childModels){
        const existingChildModelId = <string> childModel[childModelCfg.idProp];

         /** Save relations */
        const {flatModel, fullModel} = _fixModel(childModelCfg, childModel, existingChildModelId, newState, preGeneratedIds);
        flatModel[<string> rel.childKey] = foreignKey; //Set model id as foreignkey on child models
        fullChildren.push(fullModel);

        if(!existingChildModelId || preGenIds[existingChildModelId] === true) 
            childSlice.withGeneratedId.push(flatModel); 
        else 
            childSlice.withExistingId.push(flatModel);     
    } 

    newState[rel.stateProp] = childSlice;

    return fullChildren;
}

function _addForeignRelation(
    rel: ForeignRelation<any,any,any>, 
    model: UnknownState,
    foreignModel: Immutable<UnknownState>,
    newState: ExtractedModelState<any>,
    preGeneratedIds: Partial<Record<string, Record<string, boolean>>>): UnknownState {
    const fkModelCfg = _getModelConfig<any, any>(rel.stateProp); //Key information about foreign model   

    const existingFkModelId = <string> foreignModel[fkModelCfg.idProp];
 
    const {flatModel, fullModel} = _fixModel(fkModelCfg, foreignModel, existingFkModelId, newState, preGeneratedIds);

    const fkSlice = newState[rel.stateProp] || {withGeneratedId: [], withExistingId: []};    
    const preGenIds = preGeneratedIds[rel.stateProp];
    
    if(!existingFkModelId || (preGenIds !== undefined && preGenIds[existingFkModelId] === true)) 
        fkSlice.withGeneratedId.push(flatModel);
    else     
        fkSlice.withExistingId.push(flatModel);  

    newState[rel.stateProp] = fkSlice;

    model[rel.foreignKey] = flatModel[fkModelCfg.idProp]; //Set foreign key on entity

    return fullModel;
}

function _mergeWithNewStateCache(
    state: Immutable<ModelState>,
    newState: ExtractedModelState<any>
): ModelState{
    const modifiedState: ModelState = {};

    for(const stateProp in newState){ 

        const { withGeneratedId, withExistingId } = newState[stateProp];
        const { idProp } = _getModelConfig<any,any>(stateProp);
        const originalModelSlice = state[stateProp];

        if(!originalModelSlice || originalModelSlice.length === 0){
            modifiedState[stateProp] = withGeneratedId.concat(withExistingId);
            continue
        }

        if(withExistingId.length === 0){
            modifiedState[stateProp] = withGeneratedId.concat(originalModelSlice);
            continue;    
        }

        if(withExistingId.length === 1) {
            modifiedState[stateProp] = withGeneratedId.concat(_addOrUpdate<any>(originalModelSlice, withExistingId[0], idProp));
            continue;
        }
        
        const lookup = <{[key: string]: object}> _convertArrayToObject(originalModelSlice, <any> idProp)

        for(const model of withExistingId){
            const existingModel = lookup[<any>(<UnknownState>model)[idProp]];
            if(existingModel !== undefined) 
                lookup[<any>(<UnknownState>model)[idProp]] = {...existingModel, ...model};
            else
                withGeneratedId.push(model);
        }

        modifiedState[stateProp] = withGeneratedId.concat(Object.values(lookup))
    }

    return modifiedState;
}