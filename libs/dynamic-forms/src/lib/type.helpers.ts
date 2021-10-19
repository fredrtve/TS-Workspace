import { UnknownState } from "global-types";
import { ControlComponent, ControlGroupComponent, DynamicControl, DynamicControlGroup, FormStateObserverSelector, FormStateSelector, GetControlReturnValue, ValidControlObject } from "./interfaces";

/** Constructs a type safe {@link DynamicControl}.  */
export function _createControl<TControlComponent extends ControlComponent<any,any>>(
        control: DynamicControl<GetControlReturnValue<TControlComponent>, TControlComponent>
): DynamicControl<GetControlReturnValue<TControlComponent>, TControlComponent> {
    return control;
}

/** Create a function for creating type safe {@link DynamicControlGroup} for a specified TGroup. 
*  @returns A function that creates type safe {@link DynamicControlGroup} for the specified TGroup
*/
export function _createControlGroup<TForm extends object>(): 
    <TControls extends ValidControlObject<TForm>, TGroupComponent extends ControlGroupComponent<any> | null = null>(
        group: DynamicControlGroup<TForm, TControls, TGroupComponent>
    ) => DynamicControlGroup<TForm, TControls, TGroupComponent> {
    return (group) => (group)
}

/** Check if the given object is a valid control group {@link DynamicControlGroup}.
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object is a valid control group, else false.
  */
export function _isControlGroup(control: any): control is DynamicControlGroup<UnknownState, ValidControlObject<any>, any> {
    return control !== undefined && (
        (control as DynamicControlGroup<UnknownState, ValidControlObject<any>>).overrides !== undefined || 
        (control as DynamicControlGroup<UnknownState, ValidControlObject<any>>).controls !== undefined
    );
}

/** Check if the given object is a valid form state setter {@link FormStateSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
export function _isFormStateSelector(setter: unknown): setter is FormStateSelector<object, any, any, string, any> {
    return setter !== undefined 
        && (setter as FormStateSelector<object, any, any, string, any>).setter !== undefined
        && (setter as FormStateSelector<object, any, any, string, any>).stateSlice !== undefined 
        && (setter as FormStateSelector<object, any, any, string, any>).formSlice !== undefined; 
}

/** Check if the given object is a valid form state observer setter {@link FormStateObserverSetter}.
 *  @param setter - The object that should be checked.
 *  @return Returns true if the object is a valid form state setter, else false.
  */
 export function _isFormStateObserverSelector(setter: unknown): setter is FormStateObserverSelector<any, any, any> {
    return setter !== undefined  
        && (setter as FormStateObserverSelector<any, any, any>).setter !== undefined
        && (setter as FormStateObserverSelector<any, any, any>).stateSlice !== undefined 
}