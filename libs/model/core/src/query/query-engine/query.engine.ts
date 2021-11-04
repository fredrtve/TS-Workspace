import { Immutable, ShallowCopy } from "global-types";
import { QueryActions, QueryActionHandlerMap, QueryAction, InferHandlerActionValue, InferHandlerMapValue, InferHandlerMapOptions } from "./interfaces";
import { QueryBuilder } from "./query.builder";

export class QueryEngine<THandlerMap extends QueryActionHandlerMap<any, any>> {

    constructor(
        private _handlers: THandlerMap,
        private _actions: Immutable<QueryActions<THandlerMap>>[] = []
    ){}

    add<T extends keyof THandlerMap>(
        action: QueryAction<T, InferHandlerActionValue<THandlerMap[T]>>
    ): void{
        this._actions.push(<any> action);
    }   

    run(
        values: Immutable<InferHandlerMapValue<THandlerMap>[]>, 
        options: Immutable<InferHandlerMapOptions<THandlerMap>>
    ): ShallowCopy<InferHandlerMapValue<THandlerMap>>[] {
        if(!values?.length) return [];

        const builder = new QueryBuilder(this._handlers, this._actions, options);
       
        const result = [];

        for(let i = 0; i < values.length; i++){
            const res = builder.query(<ShallowCopy<InferHandlerMapValue<THandlerMap>>> { ...values[i] } );
            if(res === null) continue;
            result.push(res);
        }
        
        return result;
    }

    getActions(): Immutable<QueryActions<THandlerMap>[]> {
        return this._actions;
    }  
    
    clone(): QueryEngine<THandlerMap> {
        return new QueryEngine(this._handlers, this._actions.slice())
    }

}
