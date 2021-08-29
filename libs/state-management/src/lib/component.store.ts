import { Inject, Injectable, Optional, Self } from '@angular/core';
import { Immutable } from 'global-types';
import { ActionDispatcher } from './action-dispatcher';
import { STORE_DEFAULT_STATE, STORE_SETTINGS } from './constants/injection-tokens.const';
import { StoreSettings } from './interfaces';
import { StateBase } from './state-base';
import { StoreBase } from './store-base';
import { StoreProvidersService } from './store-providers.service';

/** Responsible for providing read and write access to a local state within its provider scope.*/
@Injectable()
export class ComponentStore<TState> extends StoreBase<TState> {

    constructor(
        @Self() dispatcher: ActionDispatcher,
        @Self() storeProviders: StoreProvidersService,
        @Optional() @Inject(STORE_SETTINGS) storeSettings: StoreSettings,      
        @Self() @Optional() @Inject(STORE_DEFAULT_STATE) defaultState: Immutable<Partial<TState>>,
    ) { 
        super(new StateBase<TState>(defaultState), dispatcher, storeProviders, storeSettings);    
    }

}