import { Type } from "@angular/core";
import { DeepPropType, Maybe, NotNull } from "global-types";
import { 
    AbstractDynamicControl, AllowFormStateSelectors, ControlArrayComponent, ControlComponent, 
    ControlFieldComponent, ControlGroupComponent, ControlOptions, DefaultControlArrayComponentOptions, 
    DefaultControlGroupComponentOptions, DynamicControlArray, DynamicControlArrayOptions, DynamicControlField, 
    DynamicControlFieldOptions, DynamicControlGroup, DynamicControlGroupOptions, GetValueTypeFromControl, 
    GetViewOptionsFromComponent, GetViewOptionsFromControl 
} from "../interfaces";

type NotFound = "$$PROP_NOT_FOUND";

/** Check if the given properties TSlice are found on TForm, also searching in nested objects. */
export type ValidFormSlice<TForm, TSlice extends string> = keyof { 
    [ P in TSlice as DeepPropType<TForm, P, NotFound> extends NotFound ? NotFound  : never ]: true 
} extends never ? TSlice : never;  

/** Represents a map of properties from TForm with an associated control */
export type ValidControlSchemaMap<TForm extends object, TInputState extends object> = { [P in keyof TForm]: ValidControlSchema<TForm[P], TInputState> }

/** Represents valid controls for TValueType */
export type ValidControlSchema<TValueType, TInputState extends object> = 
        ControlFieldSchema<TValueType, Type<ControlFieldComponent<TValueType, any>> | undefined> | 
        ControlArraySchema<
            Partial<TInputState>,
            TValueType extends (infer V)[] ? ValidControlSchema<V, Partial<TInputState>> : never, 
            Type<ControlArrayComponent<any, any>> | undefined
        > | 
        ControlGroupSchema<
            TValueType extends object ? NotNull<TValueType> : never,  
            Partial<TInputState>,
            ValidControlSchemaMap<TValueType extends object ? NotNull<TValueType> : never, TInputState>,
            Maybe<Type<ControlGroupComponent<any, any>>>
        >;

/** Represents a map of properties from TForm with an associated control schema */
export type ControlSchemaMap<TForm extends object> = { 
    [P in keyof TForm]: 
        AbstractDynamicControl<TForm[P] extends object ? TForm[P] : never,  never, TForm[P], Maybe<Type<ControlComponent<TForm[P], any>>>, any> 
}

export type DynamicControlMapFromSchema<TForm extends object, TInputState extends object, TMap extends ControlSchemaMap<any>> = {
    [P  in keyof TMap]: ConvertSchemaToControl<TForm, TInputState, TMap[P]>
} 

export type ConvertSchemaToControl<TForm extends object, TInputState extends object, TSchema> = 
    TSchema extends ControlGroupSchema<(infer ValueType), any, (infer ControlMap),(infer Component)>
        ? DynamicControlGroup<TForm, TInputState, ValueType, DynamicControlMapFromSchema<TForm, TInputState, ControlMap>, Component>
    : TSchema extends ControlArraySchema<TInputState, (infer Template), (infer Component)> 
        ? DynamicControlArray<TForm, TInputState, any[], Template, Component>
    : TSchema extends ControlFieldSchema<(infer ValueType), (infer Component)>
        ? DynamicControlField<TForm, TInputState, ValueType, Component>
    : never;

/** Represents a group of controls, and relationships between them. */
export interface ControlGroupSchema<
    TValueType extends object, 
    TInputState extends object,
    TControls extends ValidControlSchemaMap<TValueType, TInputState>,
    TGroupComponent extends Maybe<Type<ControlGroupComponent<TValueType, any>>>,
> extends DynamicControlGroup<TValueType, TInputState, TValueType, TControls, TGroupComponent>,
          ControlGroupOverridables<TValueType, TInputState, TControls, GetViewOptionsFromComponent<TGroupComponent, DefaultControlGroupComponentOptions>> {}

/** Represents a group of controls, and relationships between them. */
export interface ControlArraySchema<
    TInputState extends object,
    TTemplate extends AbstractDynamicControl<any, TInputState, any, any, any>,
    TArrayComponent extends Type<ControlArrayComponent<GetValueTypeFromControl<TTemplate>, any>> | undefined = undefined,
> extends DynamicControlArray<GetValueTypeFromControl<TTemplate>, TInputState, GetValueTypeFromControl<TTemplate>, TTemplate, TArrayComponent> ,
          ControlArrayOverridables<GetValueTypeFromControl<TTemplate>, TInputState, TTemplate, GetViewOptionsFromComponent<TArrayComponent, DefaultControlArrayComponentOptions>>{}

/** Describes the rendering, value and validation of an form control field */
export interface ControlFieldSchema<
    TValueType, 
    TControlComponent extends Type<ControlFieldComponent<TValueType, any>> | undefined = undefined
> extends DynamicControlField<never, {}, TValueType, TControlComponent>, 
          ControlFieldOverridables<never, {}, GetViewOptionsFromComponent<TControlComponent>> {}


/** Represents a map of controls and their configurable properties, allowing form state selectors. */
export type ControlOverridesMap<
    TForm extends object, 
    TInputState extends object, 
    TControls extends ControlSchemaMap<any>> = {  
    [P in keyof TControls]?: //Dont replace with ControlOverrides type, casues TS error (excessively deep/infinite)
        TControls[P] extends ControlFieldSchema<any, any> 
            ? ControlFieldOverrides<TForm, TInputState, TControls[P]>
        : TControls[P] extends ControlArraySchema<any,any> 
            ? ControlArrayOverrides<TForm, TInputState, TControls[P]> 
        : TControls[P] extends ControlGroupSchema<any, any, any, any> 
            ? ControlGroupOverrides<TForm, TInputState, TControls[P]>
        : ControlFieldOverrides<TForm, TInputState, any>
}

/** Get corresponding overrides object for a given TControl */
export type ControlOverrides<  
    TForm extends object, 
    TInputState extends object, 
    TControl extends  AbstractDynamicControl<any, any, any, any, any>
> = TControl extends ControlFieldSchema<any, any>
        ? ControlFieldOverrides<TForm, TInputState, TControl>
    : TControl extends ControlArraySchema<any,any> 
        ? ControlArrayOverrides<TForm, TInputState, TControl> 
    : TControl extends ControlGroupSchema<any, any, any, any> 
        ? ControlGroupOverrides<TForm, TInputState, TControl>
    : ControlFieldOverrides<TForm, TInputState, any>

/** Represents an object of configurable properties on TGroup, allowing form state selectors. */
export type ControlGroupOverrides<
    TForm extends object, 
    TInputState extends object, 
    TGroup extends ControlGroupSchema<any, any, any, any>
> = Partial<ControlGroupOverridables<TForm, TInputState, TGroup["controls"], Partial<GetViewOptionsFromControl<TGroup>>>>

/** Represents an object of configurable properties on TGroup, allowing form state selectors. */
export type ControlArrayOverrides<
    TForm extends object, 
    TInputState extends object, 
    TArray extends ControlArraySchema<any, any>
> = Partial<ControlArrayOverridables<TForm, TInputState, TArray["controlTemplate"], Partial<GetViewOptionsFromControl<TArray>>>>

/** Represents an object of configurable properties on TControl, allowing form state selectors. */
export type ControlFieldOverrides<
    TForm extends object, 
    TInputState extends object, 
    TControl extends ControlFieldSchema<any,any>
> = Partial<ControlFieldOverridables<TForm, TInputState, Partial<GetViewOptionsFromControl<TControl>>>>;
        

/** Represents overridable */
export interface ControlGroupOverridables<
    TForm extends object, 
    TInputState extends object, 
    TControls extends ControlSchemaMap<any>,
    TViewOptions extends object
> extends ControlOverridables<TForm, TInputState, TViewOptions>,
          AllowFormStateSelectors<DynamicControlGroupOptions, TForm, TInputState> {
    overrides?: ControlOverridesMap<TForm, TInputState, TControls> 
} 

export interface ControlArrayOverridables<
    TForm extends object, 
    TInputState extends object, 
    TTemplate extends AbstractDynamicControl<TForm, TInputState, any, any, any>,
    TViewOptions extends object
> extends ControlOverridables<TForm, TInputState, TViewOptions>,
          AllowFormStateSelectors<DynamicControlArrayOptions, TForm, TInputState> {
    templateOverrides?: ControlOverrides<TForm, TInputState, TTemplate> 
} 

export interface ControlFieldOverridables<
    TForm extends object, 
    TInputState extends object, 
    TViewOptions extends object
> extends ControlOverridables<TForm, TInputState, TViewOptions>, 
          AllowFormStateSelectors<DynamicControlFieldOptions, TForm, TInputState> { }

export interface ControlOverridables<
    TForm extends object, 
    TInputState extends object, 
    TViewOptions extends object,
> extends AllowFormStateSelectors<ControlOptions, TForm, TInputState> {
    viewOptions: AllowFormStateSelectors<TViewOptions, TForm, TInputState> 
}

