import { Injectable } from '@angular/core';
import { Immutable } from '@fretve/global-types';
import { Observable, Subject } from 'rxjs';
import { ActionCreator, DispatchedAction, StateAction } from './interfaces';

/** Responsible for providing an action observer of dispatched actions. 
 *  Primarily used by {@link EffectsSubscriber} to handle effects. */
@Injectable()
export class ActionDispatcher {

    private actionsSubject = new Subject<DispatchedAction<ActionCreator<any,any>>>();
    actions$: Observable<DispatchedAction<ActionCreator<any,any>>> = this.actionsSubject.asObservable();

    dispatch(action: StateAction, stateSnapshot: Immutable<{}>){
        this.actionsSubject.next({action, stateSnapshot});
    }
    
}