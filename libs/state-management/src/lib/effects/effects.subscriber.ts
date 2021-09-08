import { Inject, Injectable, Optional, Self } from '@angular/core';
import { Immutable, ImmutableArray } from 'global-types';
import { ActionDispatcher } from '../action-dispatcher';
import { STORE_EFFECTS } from '../constants/injection-tokens.const';
import { Effect } from '../interfaces';
import { Store } from '../store';
import { EffectsSubscriberBase } from './effects.subscriber.base';

/** Responsible for injecting effects (see {@link Effect}) for a given component
 *  Effects are handled be subscribing and dispatching the returning actions to the store. */
@Injectable()
export class EffectsSubscriber extends EffectsSubscriberBase { 

    static handledEffects: Immutable<Set<Function>> = new Set();

    constructor(
        store: Store<unknown>,
        dispatcher: ActionDispatcher,
        @Self() @Optional() @Inject(STORE_EFFECTS) effects: ImmutableArray<Effect>
    ){   
        super(store, dispatcher, effects);
        if(effects)
            EffectsSubscriber.handledEffects = new Set(effects.map(x => x.constructor));
    }

    handleEffects(effects: ImmutableArray<Effect>){
        for(const effect of effects){ 
            if(!EffectsSubscriber.handledEffects.has(effect.constructor)) {
                super.handleEffect(effect);
                EffectsSubscriber.handledEffects.add(effect.constructor);
            }
        };
    }

}

