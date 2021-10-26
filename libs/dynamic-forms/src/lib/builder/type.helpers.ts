import { ControlFieldComponent, GetControlFieldReturnValue, ControlGroupComponent, AbstractDynamicControl, ControlArrayComponent } from "../interfaces";
import { ControlFieldSchema, ControlSchemaMap, ControlGroupSchema, ControlArraySchema, ControlGroupOverridables, ControlArrayOverridables, ValidControlSchemaMap } from "./interfaces";

/** Constructs a type safe {@link DynamicControl}.  */
export function _createControlField<TControlComponent extends ControlFieldComponent<any,any>>(
    control: ControlFieldSchema<GetControlFieldReturnValue<TControlComponent>, TControlComponent>
): ControlFieldSchema<GetControlFieldReturnValue<TControlComponent>, TControlComponent> {
    return control;
}

/** Create a function for creating type safe {@link ControlGroupSchema} for a specified TGroup. 
*  @returns A function that creates type safe {@link ControlGroupSchema} for the specified TGroup
*/
export function _createControlGroup<TForm extends object>(): 
    <TControls extends ValidControlSchemaMap<TForm>, TGroupComponent extends ControlGroupComponent<any, any> | null = null>(
        group: ControlGroupSchema<TForm, TControls, TGroupComponent>
    ) => ControlGroupSchema<TForm, TControls, TGroupComponent> {
    return (group) => (group)
}

/** Constructs a type safe {@link ControlArraySchema}.  */
export function _createControlArray<TTemplate extends AbstractDynamicControl<any, any, any, any, any>, TArrayComponent extends ControlArrayComponent<any, any> | null = null>(
    control: ControlArraySchema<TTemplate, TArrayComponent>
): ControlArraySchema<TTemplate, TArrayComponent> {
    return control;
}

/** Check if the given object has control group overridables
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object has control group overridables, else false.
  */
 export function _isControlGroupOverridables(overridables: any): overridables is ControlGroupOverridables<any, any, any, any> {
    return overridables != null && (overridables as ControlGroupOverridables<any, any, any, any>).overrides !== undefined
}

/** Check if the given object has control group overridables
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object has control group overridables, else false.
  */
 export function _isControlArrayOverridables(overridables: any): overridables is ControlArrayOverridables<any, any, any, any> {
    return overridables != null && (overridables as ControlArrayOverridables<any, any, any, any>).templateOverrides !== undefined
}

/** Check if the given object is a valid control group {@link ControlGroupSchema}.
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object is a valid control group, else false.
  */
 export function _isControlGroupSchema(control: any): control is ControlGroupSchema<any, any, any> {
    return control != null && (control as ControlGroupSchema<any, any, any>).controls !== undefined;
}

/** Check if the given object is a valid control array {@link ControlArraySchema}.
 *  @param control - The control object that should be checked.
 *  @return Returns true if the object is a valid control group, else false.
  */
 export function _isControlArraySchema(control: any): control is ControlArraySchema<any, any> {
    return control != null  && (control as ControlArraySchema<any, any>).controlTemplate !== undefined
}