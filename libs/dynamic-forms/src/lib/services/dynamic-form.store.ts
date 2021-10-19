import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Immutable, Maybe } from 'global-types';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

/** Exposes form & state  */
@Injectable()
export class DynamicFormStore<TInputState extends object = never> {
    
    private stateSubject = new BehaviorSubject<Immutable<Partial<TInputState>>>(<Immutable<TInputState>> {})

    private unsubscribeAllSubject = new Subject();

    unsubscribeAll$: Observable<any> = 
        this.unsubscribeAllSubject.asObservable();

    /** An observable of the formState */
    state$: Observable<Immutable<Maybe<Partial<TInputState>>>> = 
        this.stateSubject.asObservable();

    get state(): Immutable<Partial<TInputState>> {  
        return this.stateSubject.value 
    };

    form: FormGroup;

    constructor(){ }

    /** Set the input state causing the inputState observer to emit */
    setState(state: Immutable<Partial<TInputState>>): void{ 
        this.stateSubject.next({...this.stateSubject.value, ...state});      
    }

    unsubscribeAll(): void {
        this.unsubscribeAllSubject.next();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();      
    }

}