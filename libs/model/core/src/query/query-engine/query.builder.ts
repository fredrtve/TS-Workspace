import { Immutable } from "global-types";
import { QueryChainFn, QueryActionHandlerMap, QueryActions, QueryFn, InferHandlerMapOptions, InferHandlerMapValue } from "./interfaces";

export class QueryBuilder<THandlerMap extends QueryActionHandlerMap<any, any>> {

    private _currentPosition: number = 0;
    private _actionChain: QueryChainFn<InferHandlerMapValue<THandlerMap>>[] = [];
    
    constructor(
        handlers: THandlerMap,
        actions: Immutable<QueryActions<THandlerMap>[]>,
        options: Immutable<InferHandlerMapOptions<THandlerMap>> 
    ){
        for(const action of actions){
            const handler = handlers[<keyof THandlerMap> action.type];
            if(!handler) throw Error(`Missing handler for type ${action.type}`);
            this._actionChain.push(handler(action.value, options))
        };
        this._actionChain.push((m) => m);
    }

    query: QueryFn<InferHandlerMapValue<THandlerMap>> = (model) => { 
        this._currentPosition = 0;
        return this._actionChain[0](model, this.next)
    }
 
    private next: QueryFn<InferHandlerMapValue<THandlerMap>> = (model) => 
        this._actionChain[++this._currentPosition](model, this.next)
    
}