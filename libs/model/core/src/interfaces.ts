import { Immutable, ImmutableArray, Maybe, PickByValueType, Prop, UnknownState } from '@fretve/global-types';
import { DeepRequired, PickProperties } from 'ts-essentials';

export type ValidStateModel<TModel> = Maybe<Immutable<TModel>>;
export type ValidStateModelArray<TModel> = Maybe<ImmutableArray<Maybe<TModel>>>;
export type ValidModelIdKey<TModel> = Prop<PickProperties<DeepRequired<TModel>, string | number>>;

export type ModelByStateProp<TState, TProp extends keyof TState> = 
  TState[TProp] extends ValidStateModelArray<(infer M)> ? M : never;

export type StateModels<TState> = ValueOf<{[key in keyof TState]: ModelByStateProp<TState, key> }>;

export type ValueOf<T> = T extends {[K in keyof T]: (infer M)} ? M : never;

export type ValidModelChildren<TState, TModel extends StateModels<TState>> = 
  PickByValueType<DeepRequired<TModel>, ValidStateModelArray<DeepRequired<StateModels<TState>>>>

export type ValidModelChildProperties<TState, TModel extends StateModels<TState>> = 
  keyof ValidModelChildren<TState, TModel>

export type ValidModelForeigns<TState, TModel extends StateModels<TState>> = 
  PickByValueType<DeepRequired<TModel>, DeepRequired<ValidStateModel<StateModels<TState>>>>

export type ValidModelForeignProperties<TState, TModel extends StateModels<TState>> = 
  keyof ValidModelForeigns<TState, TModel>

export type ValidRelationProps<TState, TModel extends StateModels<TState>> = 
  ValidModelForeignProperties<TState, TModel> | ValidModelChildProperties<TState, TModel> | ""
  
// export  type ValidModelState = {[key: string]: Maybe<Maybe<object>[]> }
// export type ValidModel = UnknownState ??
export type StatePropByModel<TState, TModel extends StateModels<TState>> = {
  [key in keyof TState]: TState[key] extends ValidStateModelArray<(infer M)> ? DeepRequired<M> extends DeepRequired<TModel> ? key : never : never
}[keyof TState]

export type StateSliceByModel<TState, TModel extends StateModels<TState>> = {
  [key in keyof TState]: TState[key] extends ValidStateModelArray<(infer M)> ? DeepRequired<M> extends DeepRequired<TModel> ? TState[key] : never : never
}[keyof TState]

export type StatePropByModelChildProp<TState, TModel extends StateModels<TState>, TChildProp extends ValidModelChildProperties<TState, TModel>>  = 
  TChildProp extends keyof TModel ? 
  TModel[TChildProp] extends ValidStateModelArray<(infer M)> ? 
  M extends StateModels<TState> ?
  StatePropByModel<TState, M> : never : never : never;

export type StatePropByModelForeignProp<TState, TModel extends StateModels<TState>, TChildProp extends ValidModelForeignProperties<TState, TModel>>  = 
  TChildProp extends keyof TModel ? 
  TModel[TChildProp] extends ValidStateModel<(infer M)> ? 
  M extends StateModels<TState> ?
  StatePropByModel<TState, M> : never : never : never;

export type ModelChildByChildProp<TModel, TChildProp> = TChildProp extends keyof TModel ? 
      TModel[TChildProp] extends ValidStateModelArray<(infer M)> ?  M : never : never;

export type ModelForeignByForeignProp<TModel, TForeignProp> = TForeignProp extends keyof TModel ? 
      TModel[TForeignProp] extends ValidStateModel<(infer M)> ?  M : never : never;

export type ModelForeignsMap<TState, TModel extends StateModels<TState>> = 
  {[P in ValidModelForeignProperties<TState, TModel>]: ForeignRelation< TState, TModel, P >};

export type ModelChildrenMap<TState, TModel extends StateModels<TState>> = 
  {[P in ValidModelChildProperties<TState, TModel>]: ChildRelation< TState, TModel, P >};

export type ModelConfigMap<TState> = { 
  [P in keyof TState]: TState[P] extends ValidStateModelArray<(infer M)> ? 
  M extends StateModels<TState> ? 
  Immutable<ModelConfig<TState, M, ValidModelIdKey<M>>> : 
  never : never
};

export interface ModelConfig<TState, TModel extends StateModels<TState>, TIdKey extends ValidModelIdKey<TModel> = ValidModelIdKey<TModel>> {
  /** State property containing model data */
  stateProp: StatePropByModel<TState, TModel>;
  /** A property used to get a value that unqiuely identifies the model. */
  idProp: TIdKey;
  /** Property used to get a unique value used in model views. */
  displayFn?: (t: Immutable<TModel>) => string; //ChildRelation<TState, TModel, ModelChildren<TState, TModel>>
  /** Child relations for the given model */
  children: ModelChildrenMap<TState, TModel>;
  /** Foreign relations for the given model */
  foreigns: ModelForeignsMap<TState, TModel>;
  /** A custom id generator to generate id keys for model. Leaving empty requires models to have an id set before saving. */
  idGenerator?: TIdKey extends keyof TModel ? IdGenerator<TModel[TIdKey]> : never
}

/** Represents a relation to a property of TState */
export interface StateRelation<TState> { stateProp: keyof TState }

/** Represents a one-to-many relationship for TModel[TProp] in TState */
export interface ChildRelation<
  TState, 
  TModel extends StateModels<TState>, 
  TChildProp extends ValidModelChildProperties<TState, TModel>
> extends StateRelation<TState> {
  /** A property on TState that references the child state. */
  stateProp: StatePropByModelChildProp<TState, TModel, TChildProp>;
  /** A property on child model that contains a key referencing TModel */
  childKey: ValidModelIdKey<ModelChildByChildProp<TModel, TChildProp>>
  /** Set to true if children should be deleted when parents are. */
  cascadeDelete?: boolean;
}

/** Represents a foreign relationship on TModel in TState */
export interface ForeignRelation<
  TState, 
  TModel extends StateModels<TState>, 
  TForeignProp extends ValidModelForeignProperties<TState, TModel>
> extends StateRelation<TState> {
  /** A property on TState that references the foreign state. */
  stateProp: StatePropByModelForeignProp<TState, TModel, TForeignProp>
  /** A property on TModel that contains the foreign key */
  foreignKey: ValidModelIdKey<TModel>;
}

/** Information on which relationships should be included together with model */
export interface RelationInclude<TState, TModel extends StateModels<TState>> {
  /** The model property */
  prop: StatePropByModel<TState, TModel>;
  /** Foreign properties that should be included. Set to 'all' to get all relationships */
  includes?: ValidRelationProps<TState, TModel>[];
}

/** A state slice of unknown model state */
export type UnknownModelState = { [key: string]: UnknownState[] };

/** A custom id generator used to create ids of type TType. */
export type IdGenerator<TType> = () => TType;

/** Represents the extracted models from saving a model. Ordered by state prop. */
export type ExtractedModelState<TState> = 
  {[P in keyof Partial<TState>]: TState[P] extends ValidStateModelArray<StateModels<TState>> ? 
    {withExistingId: TState[P], withGeneratedId: TState[P] } : never };

/** Represents the results from saving a model with {@link _saveModel} */
export interface SaveModelResult<TState, TModel extends StateModels<TState>>{
    modifiedState: Partial<TState>, 
    fullModel: TModel, 
    flatModels: ExtractedModelState<TState>
}