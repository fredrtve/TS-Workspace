import { AsyncValidatorFn } from "@angular/forms";
import { ConstructSliceFromPath, DeepPropsObject, DeepPropType, UnknownState } from "@fretve/global-types";
import { Observable } from "rxjs";
import { DeepRequired } from "ts-essentials";
import { AsyncValidatorSelector, FormStateObserverSelector, FormStateSelector, FormStateSelectorFn, FormStateSelectorOptions } from "../interfaces";
import { ValidFormSlice } from "./interfaces";
import { _createControlArray, _createControlField, _createControlGroup } from "./type.helpers";

type PickOr<T, P extends keyof T, Else> = [T] extends [never] ? Else : [P] extends [never] ? Else : Pick<T, P>;

/** Responsible for constructing type safe forms for a given TForm and TInputState. 
 *  @remarks Does not perform runtime checks, primarily used for type safe compilation. 
 */
export class DynamicFormBuilder<TForm extends object, TInputState extends object = {}> {

    /** Constructs selectors for TForm and TState that resolve to reactive observables. Used to bind options to form or state. */
    bind<TFormSlice extends string, TStateSlice extends keyof TInputState, TReturnValue>(
        formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[],      
        stateSlice: TStateSlice[],
        setter: FormStateSelectorFn<DeepPropsObject<ConstructSliceFromPath<TFormSlice, TForm>, TFormSlice>, Partial<PickOr<TInputState, TStateSlice, any>>, TReturnValue | Observable<TReturnValue>>,
        options?: FormStateSelectorOptions
    ): FormStateSelector<ConstructSliceFromPath<TFormSlice, TForm>, PickOr<TInputState, TStateSlice, any>, TReturnValue, string, TStateSlice> {
        return { formSlice, stateSlice, setter, options, selectorType: "regular" }
    } 

    /** Constructs selectors for TState that resolve to reactive observables. Used to bind options to state. */
    bindState<TSlice extends keyof TInputState>(  
        slice: TSlice,
        setter?: null,
        options?: FormStateSelectorOptions
    ): FormStateSelector<{}, PickOr<TInputState, TSlice, never>, TInputState[TSlice], string, TSlice>    
    bindState<TSlice extends keyof TInputState,  TReturnValue>(  
        slice: TSlice,
        setter: (state: TInputState[TSlice]) => TReturnValue | Observable<TReturnValue>,
        options?: FormStateSelectorOptions
    ): FormStateSelector<{}, PickOr<TInputState, TSlice, never>, TReturnValue,  string, TSlice>
    bindState<TSlice extends keyof TInputState, TReturnValue>(  
        slice: TSlice[],
        setter: (state: Pick<TInputState, TSlice>) => TReturnValue | Observable<TReturnValue>,
        options?: FormStateSelectorOptions
    ): FormStateSelector<{}, PickOr<TInputState, TSlice, never>, TReturnValue,  string, TSlice>
    bindState(slice: any, setter?: any, options?: FormStateSelectorOptions): FormStateSelector<never, any, any,  string, any> {
        if(Array.isArray(slice))
            return { formSlice: [], stateSlice: slice, setter: (f: any, s: any) => setter(s), options, selectorType: "regular" };

        return { 
            formSlice: [], stateSlice: [slice], options, selectorType: "regular", 
            setter: (setter === undefined || setter === null)
                ? (f: any, s: UnknownState) => s[slice] 
                : (f: any, s: UnknownState) => setter(s[slice])
        }
    } 

    /** Constructs selectors for TForm that resolve to reactive observables. Used to bind options to form. */
    bindForm<TSlice extends string>(  
        slice: ValidFormSlice<DeepRequired<TForm>, TSlice>,
        setter?: null,
        options?: FormStateSelectorOptions
    ): FormStateSelector<ConstructSliceFromPath<TSlice, TForm>, any, DeepPropType<TForm, TSlice, never>, string, never>    
    bindForm<TSlice extends string,  TReturnValue>(  
        slice: ValidFormSlice<DeepRequired<TForm>, TSlice>,
        setter: (state: DeepPropType<TForm, TSlice, never>) => TReturnValue | Observable<TReturnValue>,
        options?: FormStateSelectorOptions
    ): FormStateSelector<ConstructSliceFromPath<TSlice, TForm>, any, TReturnValue, string, never>
    bindForm<TSlice extends string, TReturnValue>(  
        slice: ValidFormSlice<DeepRequired<TForm>, TSlice>[],
        setter: (state: DeepPropsObject<ConstructSliceFromPath<TSlice, TForm>, TSlice>) => TReturnValue | Observable<TReturnValue>,
        options?: FormStateSelectorOptions
    ): FormStateSelector<ConstructSliceFromPath<TSlice, TForm>, any, TReturnValue, string, never>
    bindForm(slice: string | string[], setter?: any, options?: FormStateSelectorOptions): FormStateSelector<object, never, any,  string, never> {
        if(Array.isArray(slice))
            return { stateSlice: [], formSlice:slice, setter, options, selectorType: "regular" };

        return { 
            stateSlice: [], formSlice: [slice], options, selectorType: "regular", 
            setter: (setter === undefined || setter === null)
                ? (f: UnknownState) => f[slice] 
                : (f: UnknownState) => setter(f[slice])
        }
    } 

    /** Constructs selectors for TForm and TState with observable setters */
    bindObserver<TFormSlice extends string, TStateSlice extends keyof TInputState, TReturnValue>(
        formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[],      
        stateSlice: TStateSlice[],
        setter: FormStateSelectorFn<Observable<DeepPropsObject<ConstructSliceFromPath<TFormSlice, TForm>, TFormSlice>>, Observable<Partial<PickOr<TInputState, TStateSlice, never>>>, Observable<TReturnValue>>,
    ): FormStateObserverSelector<ConstructSliceFromPath<TFormSlice, TForm>, PickOr<TInputState, TStateSlice, never>, TReturnValue, string, TStateSlice> {
        return { formSlice, stateSlice, setter, selectorType: "observer" }
    } 

    /** Constructs an observable selector for TState that returns an async validator. */
    asyncValidator<TFormSlice extends string, TStateSlice extends keyof TInputState>(
        formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[],      
        stateSlice: TStateSlice[],
        setter: FormStateSelectorFn<Observable<DeepPropsObject<ConstructSliceFromPath<TFormSlice, TForm>, TFormSlice>>, Observable<Partial<PickOr<TInputState, TStateSlice, never>>>, AsyncValidatorFn>,
    ): AsyncValidatorSelector<ConstructSliceFromPath<TFormSlice, TForm>, PickOr<TInputState, TStateSlice, never>, string, TStateSlice> {
        return { formSlice, stateSlice, setter, selectorType: "asyncValidator" }
    } 
    
    /** Create a function for creating type safe {@link ControlGroupSchema} for a specified TGroup. 
     *  @returns A function that creates type safe {@link ControlGroupSchema} for the specified TGroup
      */
    group<TGroup extends object = TForm>(){
        return _createControlGroup<TGroup, TInputState>()
    };

    /** Constructs a type safe {@link ControlArraySchema}.  */
    array = _createControlArray<TInputState>();

    /** Constructs a type safe {@link ControlFieldSchema}.  */
    field = _createControlField;

}
