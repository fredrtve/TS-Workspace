import { UnknownState } from "global-types"
import { DeepRequired } from "ts-essentials"
import { DynamicControlGroup, FormStateBinding, FormStateBindingSetter, FormStateSetter, FormStateSetterFn, ValidControl, ValidFormSlice, ValidStateSlice } from "./interfaces"

/** Assists in constructing form state setters {@link FormStateSetter} with type safety.
 *  @param formSlice - An array of form state props that should be selected
 *  @param stateSlice - An Array of state slice props that should be selected
 *  @param setter - A function that receives selected state and returns new form state
 *  @param keepActive - Set to false to only run the setter function once at start. 
 *  @returns A form state setter {@link FormStateSetter} with the given arguments.
  */
export function _formStateSetter<TForm extends object, TFormState extends object | null, TInputState extends object | null = TFormState>(): 
<TFormSlice extends string, TStateSlice extends string>(
    formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[],      
    stateSlice: ValidStateSlice<TInputState, TStateSlice>[],
    setter: FormStateSetterFn<TForm, TFormState, TInputState, TFormSlice, TStateSlice>,
    keepActive?: boolean
 ) => FormStateSetter<TForm, TFormState, TInputState, TFormSlice, TStateSlice> {

    return <TFormSlice extends string, TStateSlice extends string>(
        formSlice: ValidFormSlice<DeepRequired<TForm>, TFormSlice>[],      
        stateSlice: ValidStateSlice<TInputState, TStateSlice>[],
        setter: FormStateSetterFn<TForm, TFormState, TInputState, TFormSlice, TStateSlice>,
        keepActive: boolean = true
    ): FormStateSetter<TForm, TFormState, TInputState, TFormSlice, TStateSlice> => {
        return { formSlice, stateSlice, setter, keepActive }
    } 
 
}

/** Assists in constructing form state binding {@link FormStateBinding} with type safety.
 *  @param props - An array of form state props that should be selected
 *  @param setter - A function that receives selected state and returns a custom output
 *  @param keepActive - Set to false to only run the setter function once at start. 
 *  @returns A form state binding {@link FormStateBinding} with the given arguments.
  */
export function _formStateBinding<TState extends object | null, TOutput>(): 
    <TSlice extends string>(
        props: ValidStateSlice<TState, TSlice>[],
        setter: FormStateBindingSetter<TState, TSlice, TOutput>
    ) => FormStateBinding<TState, TSlice, TOutput> {

    return <TSlice extends string>(
        props: ValidStateSlice<TState, TSlice>[],
        setter: FormStateBindingSetter<TState, TSlice, TOutput>
    ): FormStateBinding<TState, TSlice, TOutput>  => {
        return { props, setter }
    }
    
}

/** Check if the given object is a valid control group {@link DynamicControlGroup}.
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object is a valid control group, else false.
  */
export function _isControlGroup(control: ValidControl<any>): control is DynamicControlGroup<UnknownState, UnknownState> {
    return (control as DynamicControlGroup<UnknownState, UnknownState>).controls !== undefined;
}

/** Check if the given object is a valid form state setter {@link FormStateSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
export function _isFormStateSetter(setter: unknown): setter is FormStateSetter<object, object | null, object | null, string, string> {
    return (setter as FormStateSetter<object, object | null, object | null, string, string>).setter !== undefined
    && (setter as FormStateSetter<object, object | null, object | null, string, string>).stateSlice !== undefined 
    && (setter as FormStateSetter<object, object | null, object | null, string, string>).formSlice !== undefined; 
}

/** Check if the given object is a valid form state binding {@link FormStateBinding}.
 *  @param binding - The object that should be checked.
 *  @return Returns true if the object is a valid form state bidning, else false.
  */
export function _isFormStateBinding(binding: unknown): binding is FormStateBinding<object, string, unknown> {
    return (binding as FormStateBinding<object, string, unknown>).setter !== undefined
        && (binding as FormStateBinding<object, string, unknown>).props !== undefined  
}