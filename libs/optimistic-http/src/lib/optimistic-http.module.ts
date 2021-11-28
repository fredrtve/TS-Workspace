import { ModuleWithProviders, NgModule, Optional, Provider, Self } from '@angular/core';
import { Maybe, Prop } from '@fretve/global-types';
import { StateAction, STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { ACTION_REQUEST_MAP, OPTIMISTIC_BASE_API_URL, OPTIMISTIC_STATE_PROPS } from './constants/injection-tokens.const';
import { ActionRequestMap } from './interfaces';
import { OptimisticFeatureProvidersService } from './optimistic-feature-providers.service';
import { DispatchHttpEffect } from './state/dispatch-http.effect';;
import { HttpErrorEffect } from './state/http-error.effect';
import { HttpQueueNextEffect } from './state/http-queue-next.effect';
import { HttpQueuePushEffect } from './state/http-queue-push.effect';
import { OptimisticRequestQueuerEffect } from './state/optimistic-request-queuer.effect';
import { OptimisticReducers } from './state/reducers';

/** Responsible for providing core injectables. 
 *  Use forRoot & forFeature functions to configure providers. */
@NgModule({})
export class OptimisticHttpModule { 

  constructor(@Optional() @Self() featureProviders: OptimisticFeatureProvidersService){}

  static forRoot<TState>(actionRequestMap: Maybe<ActionRequestMap<StateAction>>, optimisticStateProps?: Prop<TState>[], baseUrl?: string): ModuleWithProviders<OptimisticHttpModule> {
    let providers: Provider[] = [
      { provide: STORE_EFFECTS, useClass: OptimisticRequestQueuerEffect, multi: true },  
      { provide: STORE_EFFECTS, useClass: DispatchHttpEffect, multi: true },
      { provide: STORE_EFFECTS, useClass: HttpQueuePushEffect, multi: true },
      { provide: STORE_EFFECTS, useClass: HttpErrorEffect, multi: true },
      { provide: STORE_EFFECTS, useClass: HttpQueueNextEffect, multi: true },
      
      { provide: STORE_REDUCERS, useValue: OptimisticReducers, multi: true },
    ];

    if(optimisticStateProps)
      providers.push({ provide: OPTIMISTIC_STATE_PROPS, useValue: optimisticStateProps})

    if(baseUrl)
      providers.push({ provide: OPTIMISTIC_BASE_API_URL, useValue: baseUrl})

    if(actionRequestMap) 
      providers.push({ provide: ACTION_REQUEST_MAP, useValue: actionRequestMap })

    return { ngModule: OptimisticHttpModule, providers }
  }

  static forFeature<TState>(actionRequestMap?: ActionRequestMap<StateAction>, optimisticStateProps?: Prop<TState>[]): ModuleWithProviders<OptimisticHttpModule> {
    let providers: Provider[] = [OptimisticFeatureProvidersService];
    
    if(optimisticStateProps)
      providers.push({ provide: OPTIMISTIC_STATE_PROPS, useValue: optimisticStateProps})

    if(actionRequestMap) 
      providers.push({ provide: ACTION_REQUEST_MAP, useValue: actionRequestMap })

    return { ngModule: OptimisticHttpModule, providers }
  }
}
