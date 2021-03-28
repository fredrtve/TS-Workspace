import { Inject, Injectable, Optional, Self, SkipSelf } from '@angular/core';
import { UnknownState } from 'global-types';
import { ActionDispatcher } from './action-dispatcher';
import { STORE_ACTION_INTERCEPTORS, STORE_DEFAULT_STATE, STORE_META_REDUCERS, STORE_REDUCERS, STORE_SETTINGS } from './constants/injection-tokens.const';
import { ActionInterceptor, MetaReducer, Reducer, StoreSettings } from './interfaces';
import { StateBase } from './state-base';
import { StateAction } from './state.action';
import { Store } from './store';
import { StoreBase } from './store-base';

/** Responsible for providing read and write access to a local state within its provider scope.*/
@Injectable()
export class ComponentStore<TState> extends StoreBase<TState> {

    constructor(
        @SkipSelf() @Optional() hostStore: Store<unknown>,
        @Self() dispatcher: ActionDispatcher,
        @Self() @Optional() @Inject(STORE_REDUCERS) reducers: Reducer<unknown, StateAction>[],
        @Self() @Optional() @Inject(STORE_META_REDUCERS) metaReducers: MetaReducer<unknown, StateAction>[],
        @Self() @Optional() @Inject(STORE_ACTION_INTERCEPTORS) interceptors: ActionInterceptor[],
        @Self() @Optional() @Inject(STORE_DEFAULT_STATE) defaultState: UnknownState,
        @Optional() @Inject(STORE_SETTINGS) storeSettings: StoreSettings,
    ) { 
        super(new StateBase(defaultState), hostStore, dispatcher, reducers, metaReducers, interceptors, storeSettings);    
    }

}