import { ModelChildByChildProp, ModelConfig, ModelForeignByForeignProp, StateModels, ValidRelationProps } from "../interfaces";
import { ModelQuery } from "./model-query";

export type IncludeRestrictions = "run" | "first" | "stateProp";

export type Restrictions = IncludeRestrictions | "";

export type RestrictedQuery<
    TState, 
    TModel extends StateModels<TState>, 
    TRestrictions extends Restrictions = "",
    TIncludedProps extends ValidRelationProps<TState, TModel> | "" = ""> = 
    Omit<ModelQuery<TState, TModel, TRestrictions, TIncludedProps>, TRestrictions>;

export type RelationPropQuery<TState, TModel extends StateModels<TState>, TProp> = 
    NestedIncludeQuery<TState, ModelForeignByForeignProp<TModel, TProp>> |
    NestedIncludeQuery<TState, ModelChildByChildProp<TModel, TProp>>;

export type QueryIncludeFn<TState, TModel extends StateModels<TState>, TProp extends ValidRelationProps<TState, TModel>> = 
    (x: RelationPropQuery<TState, TModel, TProp>) => RelationPropQuery<TState, TModel, TProp>

export type NestedIncludeQuery<TState, TRel, TRestrictions extends Restrictions = ""> = 
    TRel extends StateModels<TState> ? 
    RestrictedQuery<TState, TRel, IncludeRestrictions extends TRestrictions ? TRestrictions : TRestrictions | IncludeRestrictions> :
    never;

export interface ModelQueryHandlerOptions<TState, TModel extends StateModels<TState>>{ 
    state: Partial<TState>,
    modelConfig: ModelConfig<TState, TModel>; 
}