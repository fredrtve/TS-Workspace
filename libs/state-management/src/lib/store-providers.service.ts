import { Injector, Type } from "@angular/core";
import { _groupBy } from "array-helpers";
import { Immutable, ImmutableArray, Maybe } from "global-types";
import { _applyMetaReducers } from "./helpers/apply-meta-reducers.helper";
import { _mergeReducers } from "./helpers/merge-reducers.helper";
import { ActionInterceptor, MetaReducer, Reducer } from "./interfaces";
import { StateAction } from "./state.action";

type ReducerMap = {[key: string]: Immutable<Reducer<unknown, StateAction>>}

export interface StoreProvidersServiceToken {
    provide: Type<StoreProvidersService>,
    useFactory: (i: Injector) => StoreProvidersService,
    deps: [typeof Injector]
}

export class StoreProvidersService{

    private uniqueReducerMap: {[key: string]: Maybe<Immutable<Reducer<unknown, StateAction>>[]>} = {};

    private reducerWithMetaMap: ReducerMap = {};

    private metaReducers: MetaReducer<unknown, StateAction>[] = [];

    actionInterceptors: ImmutableArray<ActionInterceptor> = [];

    constructor(        
        reducers: Maybe<ImmutableArray<Reducer<unknown, StateAction>>>,
        metaReducers: Maybe<ImmutableArray<MetaReducer<unknown, StateAction>>>,
        interceptors: Maybe<ImmutableArray<ActionInterceptor>>,
    ){
        if(metaReducers) this.metaReducers = Array.from(new Set(metaReducers));
        if(interceptors) this.actionInterceptors = interceptors;
        if(reducers) this.addReducers(reducers);
    }

    getReducer = (type: string): Immutable<Reducer<unknown, StateAction>> => this.reducerWithMetaMap[type];

    addReducers(reducers: ImmutableArray<Reducer<unknown, StateAction>>): void{
        const groupedReducers = _groupBy(reducers, "type");
        for(const type in groupedReducers){
            const existingReducers = this.uniqueReducerMap[type];
            const uniqueReducers = Array.from(new Set([...(existingReducers || []), ...groupedReducers[type]]));
            this.setReducersForType(uniqueReducers, type)        
         }
    }

    addMetaReducers(metaReducers: ImmutableArray<MetaReducer<unknown, StateAction>>): void{
        const sizePreMerge = this.metaReducers.length; //Keep length to track new items
        this.metaReducers = Array.from(new Set([...this.metaReducers, ...metaReducers])); //Merge and remove duplicates
        const newMetas = this.metaReducers.slice(sizePreMerge, this.metaReducers.length); //Get new items appended to end
        if(!newMetas.length) return;
        for(const type in this.reducerWithMetaMap) //Loop and apply new meta reducers
            this.reducerWithMetaMap[type] = _applyMetaReducers(this.reducerWithMetaMap[type], newMetas)
    }

    addActionInterceptors(interceptors: ImmutableArray<ActionInterceptor>): void{
        this.actionInterceptors = Array.from(new Set([...this.actionInterceptors, ...interceptors]));
    }

    private setReducersForType(reducers: Immutable<Reducer<unknown, StateAction>>[], type: string): void{
        this.uniqueReducerMap[type] = reducers;
        const mergedReducer = _mergeReducers(reducers, type)   
        this.reducerWithMetaMap[type] = _applyMetaReducers(mergedReducer, this.metaReducers);
    }
}