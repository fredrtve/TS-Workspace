import { Immutable, ShallowCopy, UnionOmit } from "global-types";
import { StateModels, StatePropByModel, ValidRelationProps } from "../interfaces";
import { _getModelConfig } from "../model-state-config-helpers";
import { ModelQueryHandlerMap, QueryIncludeValue } from "./handlers";
import { QueryIncludeFn, RestrictedQuery, Restrictions } from "./interfaces";
import { InferHandlerActionValue, QueryAction } from "./query-engine/interfaces";
import { QueryEngine } from "./query-engine/query.engine";

type RemainingIncludes<TState, TModel extends StateModels<TState>, TIncludedProps extends ValidRelationProps<TState, TModel> | "" > = 
    UnionOmit<ValidRelationProps<TState, TModel>, TIncludedProps>

type ModelWithIncludes<TState, TModel extends StateModels<TState>, TIncludedProps extends ValidRelationProps<TState, TModel> | "" > = 
    Omit<TModel, RemainingIncludes<TState, TModel, TIncludedProps>>

export class ModelQuery<
    TState, 
    TModel extends StateModels<TState>,
    TRestrictions extends Restrictions = "",
    TIncludes extends ValidRelationProps<TState, TModel> | "" = "",
>{

    constructor(  
        private _stateProp: Immutable<StatePropByModel<TState, TModel>>,
        private _engine: QueryEngine<ModelQueryHandlerMap<TState, TModel>>,
    ){}

    where(
        exp: (entity: Immutable<ModelWithIncludes<TState, TModel, TIncludes>>) => boolean
    ): RestrictedQuery<TState, TModel, TRestrictions, TIncludes> {
        return this._addAction({type: 'where', value: exp})
    }
    
    include<TProp extends RemainingIncludes<TState, TModel, TIncludes>>(prop: TProp): RestrictedQuery<TState, TModel, TRestrictions, TIncludes | TProp>;
    include<TProp extends RemainingIncludes<TState, TModel, TIncludes>>(prop: TProp, query: QueryIncludeFn<TState, TModel, TProp>): RestrictedQuery<TState, TModel, TRestrictions, TIncludes | TProp>;
    include<TProp extends RemainingIncludes<TState, TModel, TIncludes>>(prop: TProp, query?: QueryIncludeFn<TState, TModel, TProp>): RestrictedQuery<TState, TModel, TRestrictions, TIncludes | TProp> {
        return <RestrictedQuery<TState, TModel, TRestrictions, TIncludes | TProp>> 
            this._addAction({type: 'include', value: {prop, query}})
    }

    first(
        state: Immutable<Partial<TState>>, 
        exp?: (entity: Immutable<ModelWithIncludes<TState, TModel, TIncludes>>) => boolean
    ): ShallowCopy<TModel> | null {
        if(exp) this._engine.add({type: 'where', value: exp});
        const res = this.run(state);
        return res.length === 0 ? null : res[0];
    }

    select<T>(
        state: Immutable<Partial<TState>>, 
        exp: (entity: Immutable<ModelWithIncludes<TState, TModel, TIncludes>>) => T
    ): ShallowCopy<T>[] {
        this._engine.add({type: 'select', value: exp});
        return <ShallowCopy<T>[]> this.run(state);
    }

    run(state: Immutable<Partial<TState>>): ShallowCopy<TModel>[] {
        if(!state) return [];
        return this._engine.run((<any> state)[this._stateProp], { state, modelConfig: _getModelConfig(this._stateProp) })
    }

    getSelectedStateProps(): string[] {
        const props: string[] = [<string> this._stateProp];
        const actions = this._engine.getActions();
        for(const entry of actions){
            if(entry.type === "include") props.push(<string> (<QueryIncludeValue<TState, TModel>> entry.value).prop)
        }
        return props;
    }

    private _addAction<T extends keyof ModelQueryHandlerMap<TState, TModel>>(
        action: QueryAction<T, InferHandlerActionValue<ModelQueryHandlerMap<TState, TModel>[T]>>
    ){
        const engineClone = this._engine.clone();
        engineClone.add(action);
        return new ModelQuery<TState, TModel, TRestrictions, TIncludes>(this._stateProp, engineClone);
    }

}
