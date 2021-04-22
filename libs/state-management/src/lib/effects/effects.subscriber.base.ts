import { Directive } from '@angular/core';
import { Immutable, ImmutableArray } from 'global-types';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, first, takeUntil, tap } from 'rxjs/operators';
import { ActionDispatcher } from '../action-dispatcher';
import { Effect, StateAction } from '../interfaces';
import { StoreBase } from '../store-base';

/** Responsible for injecting effects (see {@link Effect}) for a given component
 *  Effects are handled be subscribing and dispatching the returning actions to the store. */
@Directive()
export abstract class EffectsSubscriberBase {

    private effectsInitSubject = new BehaviorSubject<boolean>(false);
    /** A lifecycle hook that emits when all effects are subscribed to. */
    onEffectsInit$ = this.effectsInitSubject.asObservable().pipe(first(x => x === true))

    private unsubscribe : Subject<void> = new Subject();

    constructor(
        private store: StoreBase<unknown>,
        private dispatcher: ActionDispatcher,
        effects: ImmutableArray<Effect<StateAction>>
    ){   
        if(effects)  {
            for(const effect of effects) this.handleEffect(effect)
        }
        
        this.effectsInitSubject.next(true);
    }

    protected handleEffect(effect: Immutable<Effect<StateAction>>): void {
        effect.handle$(this.dispatcher.actions$).pipe(   
            tap(x => (x && x.type) ? this.store.dispatch(x) : null),   
            catchError(x => this.onEffectError$(x, effect)),
            takeUntil(this.unsubscribe),
        ).subscribe();
    }

    private onEffectError$(err: unknown, effect: Immutable<Effect<StateAction>>): Observable<unknown> {
        if(effect.onErrorAction) {
            const action = effect.onErrorAction(err)
            if(action) this.store.dispatch(action)
        }
      
        this.handleEffect(effect); //Resubscribe on error
 
        return throwError(err)
    }
  
    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
