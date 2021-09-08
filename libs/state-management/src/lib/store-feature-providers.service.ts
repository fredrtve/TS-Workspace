import { Injector, Type } from "@angular/core";
import { ImmutableArray, Maybe } from "global-types";
import { EffectsSubscriber } from "./effects/effects.subscriber";
import { ActionInterceptor, Effect, MetaReducer, Reducer, StateAction } from "./interfaces";
import { Store } from "./store";
import { StoreProvidersService } from "./store-providers.service";

export interface StoreFeatureProvidersServiceToken {
    provide: Type<StoreFeatureProvidersService>,
    deps: [Type<StoreProvidersService>, Type<Store<Object>>, Type<EffectsSubscriber>, typeof Injector], 
    useFactory: (a: StoreProvidersService, s: Store<Object>, c: EffectsSubscriber, i: Injector) => StoreFeatureProvidersService
}

export class StoreFeatureProvidersService {

    constructor(                                                                                                                       
        storeProvidersService: StoreProvidersService,
        store: Store<Object>,
        effectsSubscriber: EffectsSubscriber,
        defaultState: Maybe<Object>,
        effects: Maybe<ImmutableArray<Effect>>,
        reducers: Maybe<ImmutableArray<Reducer<unknown, StateAction>[]>>,
        metaReducers: Maybe<ImmutableArray<MetaReducer<unknown, StateAction>[]>>,
        interceptors: Maybe<ImmutableArray<ActionInterceptor>[]>,
    ){
        if(defaultState) store.addDefaultState(defaultState)
        if(reducers) storeProvidersService.addReducers(reducers);
        if(metaReducers) storeProvidersService.addMetaReducers(metaReducers);
        if(interceptors) storeProvidersService.addActionInterceptors(interceptors);
        if(effects) effectsSubscriber.handleEffects(effects);
    }
}