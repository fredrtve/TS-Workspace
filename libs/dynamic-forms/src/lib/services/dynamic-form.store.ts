import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Immutable, Maybe } from 'global-types';
import { BehaviorSubject, Observable } from 'rxjs';

/** Exposes form & state  */
@Injectable()
export class DynamicFormStore<TInputState extends object = {}> {
    
    private stateSubject = new BehaviorSubject<Immutable<Partial<TInputState>>>(<Immutable<TInputState>> {})

    /** An observable of the formState */
    state$: Observable<Immutable<Maybe<Partial<TInputState>>>> = 
        this.stateSubject.asObservable();

    get state(): Immutable<Partial<TInputState>> {  
        return this.stateSubject.value 
    };

    form: FormGroup = new FormGroup({});

    constructor(){ }

    /** Set the input state causing the inputState observer to emit */
    setState(state: Immutable<Partial<TInputState>>): void{ 
        this.stateSubject.next({...this.stateSubject.value, ...state});      
    }

}