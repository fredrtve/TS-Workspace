import { InjectionToken } from '@angular/core';
import { Reducer, Effect, MetaReducer, StoreSettings, ActionInterceptor, StateAction } from '../interfaces';

export const STORE_REDUCERS = new InjectionToken<Reducer<unknown, StateAction>[][]>('StoreReducers');
export const STORE_META_REDUCERS = new InjectionToken<MetaReducer<unknown, StateAction>[][]>("MetaReducers");
export const STORE_ACTION_INTERCEPTORS = new InjectionToken<ActionInterceptor[][]>("ActionInterceptor")
export const STORE_EFFECTS = new InjectionToken<Effect[]>('StoreEffects');

export const STORE_DEFAULT_STATE = new InjectionToken<Object>('DefaultStoreState');
export const STORE_SETTINGS = new InjectionToken<StoreSettings>('StoreSettings');
