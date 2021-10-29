import { AsyncValidatorFn } from "@angular/forms";
import { ConstructSliceFromPath, DeepPropsObject, DeepPropType, UnknownState } from "global-types";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DeepRequired } from "ts-essentials";
import { FormStateObserverSelector, FormStateSelector, FormStateSelectorFn } from "../interfaces";
import { ControlSchemaMap, DynamicForm, ValidControlSchemaMap, ValidFormSlice } from "./interfaces";
import { _createControlGroup, _createControlArray, _createControlField } from "./type.helpers";

type PickOr<T, P extends keyof T, Else> = T extends never ? Else : P extends never ? Else : Pick<T, P>;

/** Responsible for constructing type safe forms for a given TForm and TInputState. 
 *  @remarks Does not perform runtime checks, primarily used for type safe compilation. 
 */
export class DynamicFormBuilder<TForm extends object, TInputState extends object = never> {

    /** Constructs selectors for TForm and TState that resolve to reactive observables. Used to bind options to form or state. */
    bind<TFormSlice extends string, TStateSlice extends keyof TInputState, TReturnValue>(
        formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[],      
        stateSlice: TStateSlice[],
        setter: FormStateSelectorFn<DeepPropsObject<ConstructSliceFromPath<TFormSlice, TForm>, TFormSlice>, Partial<PickOr<TInputState, TStateSlice, never>>, TReturnValue>,
        onlyOnce?: boolean
    ): FormStateSelector<ConstructSliceFromPath<TFormSlice, TForm>, PickOr<TInputState, TStateSlice, never>, TReturnValue, string, TStateSlice> {
        return { formSlice, stateSlice, setter, onlyOnce }
    } 

    /** Constructs selectors for TState that resolve to reactive observables. Used to bind options to state. */
    bindState<TSlice extends keyof TInputState>(  
        slice: TSlice,
        setter?: null,
        onlyOnce?: boolean
    ): FormStateSelector<never, PickOr<TInputState, TSlice, never>, TInputState[TSlice], string, TSlice>    
    bindState<TSlice extends keyof TInputState,  TReturnValue>(  
        slice: TSlice,
        setter: (state: TInputState[TSlice]) => TReturnValue,
        onlyOnce?: boolean
    ): FormStateSelector<never, PickOr<TInputState, TSlice, never>, TReturnValue,  string, TSlice>
    bindState<TSlice extends keyof TInputState, TReturnValue>(  
        slice: TSlice[],
        setter: (state: Pick<TInputState, TSlice>) => TReturnValue,
        onlyOnce?: boolean
    ): FormStateSelector<never, PickOr<TInputState, TSlice, never>, TReturnValue,  string, TSlice>
    bindState(slice: any, setter?: any, onlyOnce?: boolean): FormStateSelector<never, any, any,  string, any> {
        if(Array.isArray(slice))
            return { formSlice: [], stateSlice: slice, setter: (f: any, s: any) => setter(s), onlyOnce };

        return { 
            formSlice: [], stateSlice: [slice], onlyOnce, 
            setter: (setter === undefined || setter === null)
                ? (f: any, s: UnknownState) => s[slice] 
                : (f: any, s: UnknownState) => setter(s[slice])
        }
    } 

    /** Constructs selectors for TForm that resolve to reactive observables. Used to bind options to form. */
    bindForm<TSlice extends string>(  
        slice: ValidFormSlice<DeepRequired<TForm>, TSlice>,
        setter?: null,
        onlyOnce?: boolean
    ): FormStateSelector<ConstructSliceFromPath<TSlice, TForm>, never, DeepPropType<TForm, TSlice, never>, string, never>    
    bindForm<TSlice extends string,  TReturnValue>(  
        slice: ValidFormSlice<DeepRequired<TForm>, TSlice>,
        setter: (state: DeepPropType<TForm, TSlice, never>) => TReturnValue,
        onlyOnce?: boolean
    ): FormStateSelector<ConstructSliceFromPath<TSlice, TForm>, never, TReturnValue, string, never>
    bindForm<TSlice extends string, TReturnValue>(  
        slice: ValidFormSlice<DeepRequired<TForm>, TSlice>[],
        setter: (state: DeepPropsObject<ConstructSliceFromPath<TSlice, TForm>, TSlice>) => TReturnValue,
        onlyOnce?: boolean
    ): FormStateSelector<ConstructSliceFromPath<TSlice, TForm>, never, TReturnValue, string, never>
    bindForm(slice: string | string[], setter?: any, onlyOnce?: boolean): FormStateSelector<object, never, any,  string, never> {
        if(Array.isArray(slice))
            return { stateSlice: [], formSlice:slice, setter, onlyOnce };

        return { 
            stateSlice: [], formSlice: [slice], onlyOnce, 
            setter: (setter === undefined || setter === null)
                ? (f: UnknownState) => f[slice] 
                : (f: UnknownState) => setter(f[slice])
        }
    } 

    /** Constructs an observable selector for TState that returns an async validator. */
    asyncValidator<TSlice extends keyof TInputState>(  
        slice: TSlice,
        setter: (state$: Observable<TInputState[TSlice]>) => AsyncValidatorFn
    ): FormStateObserverSelector<PickOr<TInputState, TSlice, never>, AsyncValidatorFn, TSlice>
    asyncValidator<TSlice extends keyof TInputState>(  
        slice: TSlice[],
        setter: (state$: Observable<Pick<TInputState, TSlice>>) => AsyncValidatorFn
    ): FormStateObserverSelector<PickOr<TInputState, TSlice, never>, AsyncValidatorFn, TSlice>
    asyncValidator(slice: string | string[], setter?: any): FormStateObserverSelector<PickOr<TInputState, any, never>, AsyncValidatorFn, any> {
        if(Array.isArray(slice))
            return { stateSlice: slice, setter };

        return { 
            stateSlice: [slice],
            setter: (state$: Observable<UnknownState>) => setter(state$.pipe(map(x => x[slice])))
        }
    } 

    /** Constructs a type safe {@link DynamicForm}.  */
    form<TControls extends ValidControlSchemaMap<TForm>>(
        form: DynamicForm<TForm, TInputState, TControls>
    ): DynamicForm<TForm, TInputState, TControls> {
        return form
    }

    /** Create a function for creating type safe {@link ControlGroupSchema} for a specified TGroup. 
     *  @returns A function that creates type safe {@link ControlGroupSchema} for the specified TGroup
      */
    group = _createControlGroup;

    /** Constructs a type safe {@link ControlArraySchema}.  */
    array = _createControlArray;

    /** Constructs a type safe {@link ControlFieldSchema}.  */
    field = _createControlField;

}
