import { InjectFlags, InjectionToken, Injector, ModuleWithProviders, NgModule, Optional, Provider, Self, Type } from '@angular/core';
import { Maybe } from 'global-types';
import { ActionDispatcher } from './action-dispatcher';
import { ComponentStore } from './component.store';
import { STORE_ACTION_INTERCEPTORS, STORE_DEFAULT_STATE, STORE_EFFECTS, STORE_META_REDUCERS, STORE_REDUCERS } from './constants/injection-tokens.const';
import { ComponentEffectsSubscriber } from './effects/component-effects.subscriber';
import { EffectsSubscriber } from './effects/effects.subscriber';
import { StateManagementProviders } from './interfaces';
import { Store } from './store';
import { StoreFeatureProvidersService, StoreFeatureProvidersServiceToken } from './store-feature-providers.service';
import { StoreProvidersService, StoreProvidersServiceToken } from './store-providers.service';

/**
 * Responsible for configuring providers
 * Required in root to setup core providers with the forRoot function.
 * that configures state providers like {@link Reducer} or {@link Effect}.
 */
@NgModule()
export class StateManagementModule {
    
    constructor(@Optional() @Self() featureProviders: StoreFeatureProvidersService){}

    /** Configures root providers. Required even if no custom providers are neccesary. */
    static forRoot(c: StateManagementProviders): ModuleWithProviders<StateManagementModule> {
        const effectProviders = this.getClassProviders(c.effects, STORE_EFFECTS);
        const interceptorProviders = this.getClassProviders(c.actionInterceptors, STORE_ACTION_INTERCEPTORS);
        return {
            ngModule: StateManagementModule,
            providers: [
                ActionDispatcher, 
                EffectsSubscriber,
                Store, 
                { provide: STORE_DEFAULT_STATE, useValue: c.defaultState },
                ...effectProviders,
                ...interceptorProviders,
                <StoreProvidersServiceToken> { 
                  provide: StoreProvidersService,
                  useFactory: this.getStoreProvidersServiceFactory(c),
                  deps: [Injector]
                },
            ]
        }
    }

    /** Configures feature providers. Only required if there are custom feature specific providers */
    static forFeature(c: StateManagementProviders): ModuleWithProviders<StateManagementModule> {
        const providers: Provider[] = this.getClassProviders(c.actionInterceptors, STORE_ACTION_INTERCEPTORS); 

        if(c.effects) 
            for(let effect of c.effects) {
                if(!EffectsSubscriber.handledEffects.has(effect)) //Filter for existing effects
                    providers.push({provide: STORE_EFFECTS, useClass: effect, multi: true})
            }

        providers.push(<StoreFeatureProvidersServiceToken>{
            provide: StoreFeatureProvidersService,
            deps: [StoreProvidersService, Store, EffectsSubscriber, Injector],
            useFactory: (x, y, z, i) =>  
                new StoreFeatureProvidersService(x, y, z, c.defaultState, 
                    i.get(STORE_EFFECTS, [], InjectFlags.Self), 
                    this.getAndMerge(i, STORE_REDUCERS, c.reducers),
                    this.getAndMerge(i, STORE_META_REDUCERS, c.metaReducers),
                    i.get(STORE_ACTION_INTERCEPTORS, [], InjectFlags.Self),
                )      
        })
        
        return { ngModule: StateManagementModule, providers }
    }

    /** Configures component providers for a component store. Required even if no custom providers are neccesary */
    static forComponent(c: StateManagementProviders): Provider[] {
        const interceptorProviders = this.getClassProviders(c.effects, STORE_ACTION_INTERCEPTORS);
        let providers: Provider[] = [
            ActionDispatcher, 
            ComponentStore, 
            ...interceptorProviders,
            { provide: STORE_DEFAULT_STATE, useValue: c.defaultState },
            <StoreProvidersServiceToken> { 
                provide: StoreProvidersService,
                useFactory: this.getStoreProvidersServiceFactory(c),
                deps: [Injector]
              },
        ];

        if(c.effects) providers = [...providers,
            ComponentEffectsSubscriber,
            ...this.getClassProviders(c.effects, STORE_EFFECTS)
        ];
        
        return providers
    }

    private static getClassProviders(values: Maybe<Type<unknown>[]>, token: InjectionToken<unknown>): Provider[] { 
        if(!values) return [];
        const providers = values.map(val => { return { provide: token, useClass: val, multi: true } });
        return providers
    }

    private static getStoreProvidersServiceFactory(c: StateManagementProviders): StoreProvidersServiceToken['useFactory'] {
        const factory = (i: Injector) => new StoreProvidersService(
                this.getAndMerge(i, STORE_REDUCERS, c.reducers),
                this.getAndMerge(i, STORE_META_REDUCERS, c.metaReducers),
                i.get(STORE_ACTION_INTERCEPTORS, [], InjectFlags.Self)
            )     
        return factory;
    }

    private static getAndMerge<T>(i:Injector, token: InjectionToken<T[][]>, arr: Maybe<T[]>): T[][] {
        const items = i.get(token, [], InjectFlags.Self).slice();
        if(arr) items.push(arr);
        return items
    }
    
}
  