import { DynamicControlArray, DynamicControlGroup, FormStateObserverSelector, FormStateSelector } from "../interfaces";

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
export function _isFormStateSelector(setter: unknown): setter is FormStateSelector<object, any, any, string, any> {
    return setter != null 
        && (setter as FormStateSelector<object, any, any, string, any>).setter !== undefined
        && (setter as FormStateSelector<object, any, any, string, any>).stateSlice !== undefined 
        && (setter as FormStateSelector<object, any, any, string, any>).formSlice !== undefined; 
}

/** Check if the given object is a valid form state observer setter {@link FormStateObserverSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
 export function _isFormStateObserverSelector(setter: unknown): setter is FormStateObserverSelector<any, any, any> {
    return setter != null 
        && (setter as FormStateObserverSelector<any, any, any>).setter !== undefined
        && (setter as FormStateObserverSelector<any, any, any>).stateSlice !== undefined 
}