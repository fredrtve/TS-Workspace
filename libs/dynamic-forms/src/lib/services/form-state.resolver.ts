import { Injectable } from "@angular/core";
import { DeepPropsObject, Immutable, UnknownState } from "global-types";
import { combineLatest, Observable, of, Subject } from "rxjs";
import { distinctUntilChanged, map, take, takeUntil } from "rxjs/operators";
import { _formControlsChanges$ } from "../helpers/select-form-controls.helper";
import { AllowFormStateSelectors, FormStateObserverSelector, FormStateSelector } from "../interfaces";
import { selectState } from "../helpers/select-state.operator";
import { _isFormStateObserverSelector, _isFormStateSelector } from "../helpers/type.helpers";
import { DynamicFormStore } from "./dynamic-form.store";

@Injectable()
export class FormStateResolver {

    private unsubscribeAllSubject = new Subject();

    private unsubscribeAll$: Observable<any> = 
        this.unsubscribeAllSubject.asObservable();
        
    constructor(private store: DynamicFormStore<object>){}

    resolveSlice$<T extends object>(setters: AllowFormStateSelectors<T, any,any>): Observable<Immutable<T>> {
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
        setter: FormStateSelector<any, any, T, any, any> | T
    ): Observable<Immutable<T>> {
        if(_isFormStateSelector(setter)){
            
            const observer =  combineLatest([
                this._resolveFormSlice$(setter.formSlice, setter.baseFormPath), 
                this._resolveStateSlice$(setter.stateSlice)
            ]).pipe(
                map(x => {
                    return <Immutable<T>> setter.setter(<DeepPropsObject<object, string>> x[0], <DeepPropsObject<object, string>> x[1])
                }),
                distinctUntilChanged(),
                takeUntil(this.unsubscribeAll$)
            );

            if(setter.onlyOnce === true) return observer.pipe(take(1));
            else return observer;    
        } 

        return of(<Immutable<T>> setter)
    };

    resolve<T>(
        setter: FormStateObserverSelector<any, T, any> | T
    ): Immutable<T> {
        if(_isFormStateObserverSelector(setter))
            return <Immutable<T>> setter.setter( 
                this._resolveStateSlice$(setter.stateSlice)
            ); 
        
        return <Immutable<T>> setter
    };

    ngOnDestroy(): void {
        console.log('completed')
        this.unsubscribeAllSubject.next();      
    }

    private _resolveStateSlice$<T = DeepPropsObject<object | null, string>>(stateSlice: string[]) {
        return <Observable<T>> (stateSlice.length === 0 ? of(undefined) : this.store.state$.pipe(<any>selectState<UnknownState>(stateSlice)));
    } 

    private _resolveFormSlice$<T = DeepPropsObject<object | null, string>>(formSlice: string[], basePath?: string)  {
        return <Observable<T>> (formSlice.length === 0 ? of(undefined) : _formControlsChanges$(this.store.form, formSlice, basePath));
    }
}