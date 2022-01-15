import { Injectable } from "@angular/core";
import { AsyncValidatorFn } from "@angular/forms";
import { DeepPropsObject, Immutable, UnknownState } from "@fretve/global-types";
import { asapScheduler, combineLatest, isObservable, Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from "rxjs/operators";
import { _formControlsChanges$ } from "../helpers/form-control-changes.helper";
import { selectState } from "../helpers/select-state.operator";
import { _isAsyncValidatorSelector, _isFormStateObserverSelector, _isFormStateSelector } from "../helpers/type.helpers";
import { AllowedFormStateSelector, AllowFormStateSelectors, AsyncValidatorSelector } from "../interfaces";
import { DynamicFormStore } from "./dynamic-form.store";

@Injectable()
export class FormStateResolver {

    private unsubscribeAllSubject = new Subject();

    private unsubscribeAll$: Observable<any> = 
        this.unsubscribeAllSubject.asObservable();
        
    constructor(private store: DynamicFormStore<object>){}

    resolveSlice$<T extends object>(setters: Immutable<AllowFormStateSelectors<T, any,any>>): Observable<Immutable<T>> {
        const observers: Observable<any>[] = [];
        const usedKeys: string[] = [];
        for(const key in setters){
            const setter = setters[key];
            if(setter === undefined) continue;
            observers.push(this.resolve$(<any> setter));
            usedKeys.push(key);
        }
        if(observers.length === 0) return of(<Immutable<T>> {});
        return combineLatest(observers).pipe(map(values => {
            const res = <UnknownState> {};
            for(const index in values) res[usedKeys[index]] = values[index];
            return <Immutable<T>> res;
        }))
    }

    resolve$<T>(
        setter: Immutable<AllowedFormStateSelector<T, any, any>>
    ): Observable<Immutable<T>> {
        if(_isFormStateSelector(setter)){         
            let observer =  combineLatest([
                this._resolveFormSlice$(setter.formSlice, setter.baseFormPath), 
                this._resolveStateSlice$(setter.stateSlice)
            ]).pipe(
                switchMap(x => {
                    const value = setter.setter(x[0], x[1]);
                    return isObservable(value) ? value : of(value);
                }),
            );
 
            if(setter.options?.onlyOnce === true) 
                observer = observer.pipe(take(1));
                
            if(setter.options?.distinct === undefined || setter.options.distinct === true) 
                observer = observer.pipe(distinctUntilChanged());    
            
            return observer.pipe(
                debounceTime(0, asapScheduler), 
                takeUntil(this.unsubscribeAll$)
            );    
        } 
        if(_isFormStateObserverSelector(setter)){
            return setter.setter(
                this._resolveFormSlice$(setter.formSlice, setter.baseFormPath), 
                this._resolveStateSlice$(setter.stateSlice)
            ).pipe(
                distinctUntilChanged(),
                debounceTime(0, asapScheduler), 
                takeUntil(this.unsubscribeAll$)
            )
        }

        return of(<Immutable<T>> setter)
    };

    resolveAsyncValidator(
        setter: Immutable<AsyncValidatorSelector<any, any, any, any> | Immutable<AsyncValidatorFn>>
    ): Immutable<AsyncValidatorFn> {
        if(_isAsyncValidatorSelector(setter))
            return setter.setter( 
                this._resolveFormSlice$(setter.formSlice, setter.baseFormPath), 
                this._resolveStateSlice$(setter.stateSlice)
            ); 
        
        return <AsyncValidatorFn> setter
    };

    ngOnDestroy(): void {
        this.unsubscribeAllSubject.next(null);      
    }

    private _resolveStateSlice$<T = DeepPropsObject<object | null, string>>(stateSlice: string[]) {
        return <Observable<T>> (stateSlice.length === 0 ? of(undefined) : this.store.state$.pipe(<any>selectState<UnknownState>(stateSlice)));
    } 

    private _resolveFormSlice$<T = DeepPropsObject<object | null, string>>(formSlice: string[], basePath?: string)  {
        return <Observable<T>> (formSlice.length === 0 ? of(undefined) : _formControlsChanges$(this.store.form, formSlice, basePath));
    }
}