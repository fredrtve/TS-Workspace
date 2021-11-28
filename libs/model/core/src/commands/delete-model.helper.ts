import { _convertArrayToObject, _removeById, _removeRangeById } from '@fretve/array-helpers';
import { Immutable, ImmutableArray, Maybe, Prop, UnknownState } from '@fretve/global-types';
import { ChildRelation, StateModels, StatePropByModel } from '../interfaces';
import { _getModelConfig } from '../model-state-config-helpers';

/**  
 * Responsible for deleting model with given id(s) 
 * and children with cascadeDelete set to true. 
 * @param state - The state containing model & child state.
 * @param stateProp - The state property of the model thats being deleted.
 * @param cfg - The id or ids of the model(s) to be deleted.
 * @returns Updated state with deletion applied. 
*/
export function _deleteModel<TState, TModel extends StateModels<TState>>(
  state: Immutable<TState>, 
  stateProp: Immutable<StatePropByModel<TState,TModel>>, 
  cfg: {id?: string | number, ids?: Immutable<string[] | number[]>}
): Immutable<Partial<TState>> {

  if(!cfg.id && !cfg.ids) return  <Immutable<Partial<TState>>> {}     

  const {idProp, children} = _getModelConfig<TState, TModel>(stateProp);
  const slice = <Immutable<UnknownState[]>> (<any> state)[stateProp];
  const filtered = cfg.ids ? 
    _removeRangeById<UnknownState>(slice, cfg.ids, idProp) : 
    _removeById<UnknownState>(slice, cfg.id, idProp);

  const newState: UnknownState = {};

  if(filtered?.length < slice?.length) newState[<string> stateProp] = filtered;
  const lookup = cfg.ids ? _convertArrayToObject<string | number>(cfg.ids) : {[cfg.id!]: true};
  for(var childModelProp in children){
    const childRel = <ChildRelation<any, any, any>> children[childModelProp];
    if(!childRel.cascadeDelete) continue;
    removeModelsByForeignKey(childRel.stateProp, childRel.childKey, <any> lookup, <any> state, newState)
  }

  return <Immutable<Partial<TState>>> newState;
}

function removeModelsByForeignKey(
  stateProp: string,
  foreignKey: string,
  valueLookup: {[key: string]: boolean},
  state: Immutable<UnknownState>,
  newState: UnknownState
){
  const {idProp, children} = _getModelConfig<any,any>(stateProp)
  const modelSlice = <Immutable<UnknownState[]>> (<any> state)[stateProp];

  const {removedIds, newValues} = _removeRangeByProp(modelSlice, foreignKey, idProp, undefined, valueLookup);

  if(!removedIds) return;

  newState[stateProp] = newValues;

  for(var childModelProp in children){
    const childRel = <ChildRelation<any, any, any>> children[childModelProp];

    if(!childRel.cascadeDelete) continue;

    removeModelsByForeignKey(childRel.stateProp, childRel.childKey, removedIds, state, newState)
  }
}

function _removeRangeByProp<T>(
  originals: Maybe<ImmutableArray<T>>, 
  prop: Prop<Immutable<T>>,
  idProp: Prop<Immutable<T>>,  
  value?: unknown,
  valueLookup?: {[key: string]: unknown}, ): { newValues: Immutable<T>[], removedIds?: {[key: string]: boolean} } {    
      if(!originals?.length) return {newValues: []}; //If initial array empty, just return empty array

      const copy = originals.slice();   
      let delCount = 0;
      const removedIds: {[key: string]: boolean} = {};
      const expression = value === undefined ? 
        (t: UnknownState) => t && valueLookup![<string> t[prop]] !== undefined :
        (t: UnknownState) => t && t[prop] === value;

      for(let i = 0; i < originals.length; i++) 	{
          const index = i - delCount;
          const item = copy[index];	
          if(expression(<UnknownState> item)){              
              copy.splice(index, 1);
              delCount = delCount + 1;
              removedIds[<string> item[idProp]] = true
          }
      }

      return {newValues: copy, removedIds: delCount === 0 ? undefined : removedIds};
}