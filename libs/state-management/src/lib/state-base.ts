import { Immutable, Maybe } from '@fretve/global-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { _deepFreeze } from './helpers/object-freezer.helper';

export class StateBase<TState> {  
    
    strictImmutability: Maybe<boolean>;

    private storeStateSubject: BehaviorSubject<Immutable<TState>>;
    storeState$: Observable<Immutable<TState>>;

    get storeState(): Immutable<TState> { return this.storeStateSubject.value }

    constructor(defaultState?: Immutable<Partial<TState>>){ 
        this.storeStateSubject = new BehaviorSubject({...<Immutable<TState>> (defaultState ||  {})});
        this.storeState$ = this.storeStateSubject.asObservable();
    }

    setStoreState(stateChanges: Maybe<Immutable<Partial<TState>>>): void {
        if(!stateChanges) return;

        const newState: Immutable<TState> = {...this.storeStateSubject.value, ...stateChanges};

        if(this.strictImmutability) _deepFreeze(newState);
        this.storeStateSubject.next(newState);
    }

}