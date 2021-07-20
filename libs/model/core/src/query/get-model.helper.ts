import { _filter, _find } from 'array-helpers';
import { _weakMemoizer }  from "global-utils";
import { Immutable, Maybe, UnknownState } from 'global-types';
import { ChildRelation, ForeignRelation, RelationInclude, StateModels, UnknownModelState } from '../interfaces';
import { _getModelConfig } from '../model-state-config-helpers';


function setForeignModel(state: Immutable<UnknownModelState>, model: UnknownState, fkRel: ForeignRelation<any, any, any>, fkModelProp: string){
    const fkModelCfg = _getModelConfig<any, any>(fkRel.stateProp);
    model[fkModelProp] = //Set foreign prop in model equals to foreign with ID = fk id
        _find(state[fkRel.stateProp], model[<string> fkRel.foreignKey], fkModelCfg.idProp);
}

function setChildModels(state: Immutable<UnknownModelState>, model: UnknownState, chRel: ChildRelation<any, any, any>, childModelProp: string, id: unknown){
    model[childModelProp] = //Set child prop in model equals to children with ID = childkey id
        _filter((<Immutable<UnknownModelState>> state)[chRel.stateProp], (x) => x[<string> chRel.childKey] === id);
}

/**
 * Get model with specified relationships set on model
 * according to model property config {@link ModelConfig}
 * @param state - State containing model and relationship data
 * @param cfg - Configuration of which relationships to include
 * @param id - A unique property value of the model that is requested.
 * @returns The requested model with relationships applied if found. 
 */
export const _getModel = _weakMemoizer(getModel)

function getModel<TState, TModel extends StateModels<TState>>( 
    state: Immutable<Partial<TState>>,
    id: unknown,   
    include: Immutable<RelationInclude<TState, TModel>>,
): Maybe<Immutable<TModel>> {
    const modelCfg = _getModelConfig(include.prop); 

    const modelState = (<UnknownModelState> state)[<string> include.prop];
    if(!modelState || modelState.length === 0) return;

    const model = _find(modelState, id, modelCfg.idProp);
    
    if(!model) return;
    let modelClone = {...model};

    if(include.foreigns){
        const props = include.foreigns === "all" ? Object.keys(modelCfg.foreigns) : include.foreigns;
        for(const fkModelProp of props){
            const fkRel = <ForeignRelation<any, any, any>> (<UnknownState> modelCfg.foreigns)[<string> fkModelProp];
            setForeignModel(<UnknownModelState> state, modelClone, fkRel, <string> fkModelProp);
        }
    }

    if(include.children){
        const props = include.children === "all" ? Object.keys(modelCfg.children) : include.children;
        for(const childModelProp of props){
            const chRel = <ChildRelation<any, any, any>> (<UnknownState> modelCfg.children)[<string> childModelProp];
            if(!chRel) throw new Error(`'${include.prop}' has no child model configuration for '${childModelProp}'`);
            setChildModels(<Immutable<UnknownModelState>> state, modelClone, chRel, <string> childModelProp, id)
        }
    }

    return <Immutable<TModel>> modelClone;
}