import { Inject, Injectable, Optional, Self } from '@angular/core';
import { ImmutableArray } from '@fretve/global-types';
import { ActionDispatcher } from '../action-dispatcher';
import { ComponentStore } from '../component.store';
import { STORE_EFFECTS } from '../constants/injection-tokens.const';
import { Effect } from '../interfaces';
import { EffectsSubscriberBase } from './effects.subscriber.base';

/** Responsible for injecting effects (see {@link Effect}) within its provider scope
 *  Effects are handled be subscribing and dispatching the returning actions to the store. */
@Injectable()
export class ComponentEffectsSubscriber extends EffectsSubscriberBase {

    constructor(
        @Self() store: ComponentStore<unknown>,
        @Self() dispatcher: ActionDispatcher,
        @Self() @Optional() @Inject(STORE_EFFECTS) effects: ImmutableArray<Effect>
    ){   
        super(store, dispatcher, effects)
    }

}
