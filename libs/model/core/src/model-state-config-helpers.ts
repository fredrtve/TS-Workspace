import { Immutable } from "@fretve/global-types";
import { ModelConfig, ModelConfigMap, StateModels, StatePropByModel, ValidModelIdKey } from "./interfaces";

let _modelConfigs: object;

/** Set model configurations. Should be called once on initalization.  */
export function _registerModelStateConfig<
    TState, 
    TConfigMap extends ModelConfigMap<TState> = ModelConfigMap<TState>
>(configMap: Immutable<TConfigMap>): void{
    _modelConfigs = {..._modelConfigs, ...configMap}; 
}

/** Get model config for given state property */
export function _getModelConfig<
  TState, 
  TModel extends StateModels<TState>,
  TConfig extends ModelConfig<TState, TModel, ValidModelIdKey<TModel>> = ModelConfig<TState, TModel, ValidModelIdKey<TModel>>
>(
  prop: Immutable<StatePropByModel<TState, TModel>>
): Immutable<TConfig> {
  if(!_modelConfigs) throw Error('Trying to get model config before ')
  return _modelConfigs[<keyof object> prop];
}