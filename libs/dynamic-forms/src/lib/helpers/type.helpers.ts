import { AsyncValidatorSelector, DynamicControlArray, DynamicControlGroup, FormStateObserverSelector, FormStateSelector, ReactiveSelector } from "../interfaces";

/** Check if the given object is a valid control group {@link ControlGroupSchema}.
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object is a valid control group, else false.
  */
 export function _isControlGroup(control: any): control is DynamicControlGroup<any, any, any, any, any> {
    return control != null && (control as DynamicControlGroup<any, any, any, any, any>).controls !== undefined;
}

/** Check if the given object is a valid control array {@link ControlArraySchema}.
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object is a valid control group, else false.
  */
 export function _isControlArray(control: any): control is DynamicControlArray<any, any, any, any, any> {
    return control != null  && (control as DynamicControlArray<any, any, any, any, any>).controlTemplate !== undefined
}

/** Check if the given object is a valid form state setter {@link FormStateSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
export function _isReactiveSelector(setter: unknown): setter is ReactiveSelector<any,any> {
    return setter != null 
        && (setter as ReactiveSelector<any,any>).formSlice !== undefined
        && (setter as ReactiveSelector<any,any>).stateSlice !== undefined
        && (setter as ReactiveSelector<any,any>).setter !== undefined;
}

/** Check if the given object is a valid form state setter {@link FormStateSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
export function _isFormStateSelector(setter: unknown): setter is FormStateSelector<object, any, any, string, any> {
    return setter != null 
        && (setter as FormStateSelector<object, any, any, string, any>).selectorType === "regular";
}

/** Check if the given object is a valid form state observer setter {@link FormStateObserverSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
 export function _isFormStateObserverSelector(setter: unknown): setter is FormStateObserverSelector<object, any, any, string, any> {
    return setter != null 
        && (setter as FormStateObserverSelector<object, any, any, string, any>).selectorType === "observer";
}

/** Check if the given object is a valid form state observer setter {@link FormStateObserverSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
export function _isAsyncValidatorSelector(setter: unknown): setter is AsyncValidatorSelector<object, any, string, any> {
    return setter != null 
        && (setter as AsyncValidatorSelector<object, any, string, any>).selectorType === "asyncValidator";
}