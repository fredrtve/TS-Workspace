import { Type } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DeepPropsObject, DeepPropType, Immutable, MakeKeysOptionalIfOptionalObject, Maybe, NotNull, ValueOf } from 'global-types';
import { Observable } from 'rxjs';
import { DeepPartial } from 'ts-essentials';

export type GetControlFieldReturnValue<T> = T extends ControlFieldComponent<(infer V), any> ? V : never;
export type GetOptionsFromComponent<T> = T extends ControlFieldComponent<any, (infer Q)> ? Q : never;
export type GetGroupControlViewOptions<T> = T extends DynamicControlGroup<any, any, (infer C)> ? GetGroupComponentOptions<C> : never;
export type GetGroupComponentOptions<T> = T extends ControlGroupComponent<(infer O)> ? O : DefaultControlGroupComponentOptions;
export type GetArrayComponentOptions<T> = T extends ControlArrayComponent<(infer O)> ? O : DefaultControlArrayComponentOptions;

/** Represents a function that converts an error to a readable error message */
export type ErrorDisplayFn = (err: unknown) => string;

/** Represents a map of controls that should be disabled */
export type DisabledControls<TForm> = {[P in keyof NotNull<TForm>]: boolean };

/** Represents a map of controls with callbacks that are called on form value changes. Return true on callback to hide control. */
export type HideOnValueChanges<TForm> = {[P in keyof NotNull<TForm>]: (val: TForm) => boolean }

/** Represents an async validator that reacts to an observer of state T */
export type AsyncStateValidator<T> = ((state$: Observable<T>) => AsyncValidatorFn);

/** Represents a map of properties from TForm with an associated control */
export type ValidControlObject<TForm extends object> = { [P in keyof TForm]: ValidControl<TForm[P]> }
export type GenericControlObject = {[P in keyof object]: ValidControl<any> | ValidControl<any[]> }

export type FormControlType<TControl> =  
    TControl extends DynamicControlField<(infer ValueType), any> ? (GenericAbstractControl<ValueType> & FormControl)
    : TControl extends DynamicControlArray<any,any> ? FormArray 
    : TControl extends DynamicControlGroup<any, any, any> ? FormGroup
    : FormControl

/** Represents valid controls for TValueType */
export type ValidControl<TValueType> = 
        DynamicControlField<TValueType, ControlFieldComponent<TValueType, any>> | 
        DynamicControlArray<
            TValueType extends (infer V)[] ? ValidControl<V> : never, 
            ControlArrayComponent<any> | null
        > | 
        DynamicControlGroup<
            TValueType extends object ? NotNull<TValueType> : never, 
            ValidControlObject<TValueType extends object ? NotNull<TValueType> : never>,
            ControlGroupComponent<any> | null
        >;

type NotFound = "$$PROP_NOT_FOUND";

/** Check if the given properties TSlice are found on TForm, also searching in nested objects. */
export type ValidFormSlice<TForm, TSlice extends string> = keyof { 
    [ P in TSlice as DeepPropType<TForm, P, NotFound> extends NotFound ? NotFound  : never ]: true 
} extends never ? TSlice : never;  

/** Check if the given properties TSlice are found on TState, not searching in nested objects. */
export type ValidStateSlice<TState, TSlice extends keyof TState> = keyof { 
    [ P in TSlice as P extends keyof TState ? P : never]: true 
} 

/** Represents a map of controls and their configurable properties, allowing form state selectors. */
export type ControlOverridesMap<
    TForm extends object, 
    TInputState extends object, 
    TControls extends ValidControlObject<any>> = MakeKeysOptionalIfOptionalObject<{  
    [P in keyof TControls]: 
        TControls[P] extends DynamicControlField<any, any>
            ? ControlFieldOverrides<TForm, TInputState, TControls[P]>
        : TControls[P] extends DynamicControlArray<any,any> 
            ? ControlArrayOverrides<TForm, TInputState, TControls[P]> 
        : TControls[P] extends DynamicControlGroup<any, any, any> 
            ? ControlGroupOverrides<TForm, TInputState, TControls[P]>
        : ControlFieldOverrides<TForm, TInputState, any>
}>

/** Get corresponding overrides object for a given TControl */
export type ControlOverrides<
    TForm extends object, 
    TInputState extends object, 
    TControl extends  ValidControl<any>
> = TControl extends DynamicControlField<any, any>
        ? ControlFieldOverrides<TForm, TInputState, TControl>
    : TControl extends DynamicControlArray<any,any> 
        ? ControlArrayOverrides<TForm, TInputState, TControl> 
    : TControl extends DynamicControlGroup<any, any, any> 
        ? ControlGroupOverrides<TForm, TInputState, TControl>
    : ControlFieldOverrides<TForm, TInputState, any>

/** Represents an object of configurable properties on TGroup, allowing form state selectors. */
export type ControlGroupOverrides<
    TForm extends object, 
    TInputState extends object, 
    TGroup extends DynamicControlGroup<any, any, any>
> = 
    AllowFormStateSelectors<Partial<DynamicControlGroupOptions>, TForm, TInputState> 
    & { 
        viewOptions?: AllowFormStateSelectors<Partial<GetGroupControlViewOptions<TGroup>>, TForm, TInputState> 
        overrides?: ControlOverridesMap<TForm, TInputState, TGroup["controls"]> 
    }

/** Represents an object of configurable properties on TGroup, allowing form state selectors. */
export type ControlArrayOverrides<
    TForm extends object, 
    TInputState extends object, 
    TArray extends DynamicControlArray<any, any>
> = 
    AllowFormStateSelectors<Partial<DynamicControlArrayOptions>, TForm, TInputState> 
    & { 
        viewOptions?: AllowFormStateSelectors<Partial<TArray["viewOptions"]>, TForm, TInputState> 
        templateOverrides?: ControlOverrides<TForm, TInputState, TArray["controlTemplate"]> 
    }

/** Represents an object of configurable properties on TControl, allowing form state selectors. */
export type ControlFieldOverrides<
    TForm extends object, 
    TInputState extends object, 
    TControl extends DynamicControlField<any,any>
> = 
    AllowFormStateSelectors<Partial<DynamicControlFieldOptions>, TForm, TInputState>
    & { viewOptions?: AllowFormStateSelectors<Partial<TControl["viewOptions"]>, TForm, TInputState> }
        

/** Represents a selector for a slice of form and state */
export interface FormStateSelector<
    TForm extends object, 
    TInputState extends object,
    TReturnValue, 
    TFormSlice extends string, 
    TStateSlice extends keyof TInputState> {
    formSlice: TFormSlice[],
    stateSlice: TStateSlice[],
    setter: FormStateSelectorFn<DeepPropsObject<TForm, TFormSlice>, Partial<TInputState>, TReturnValue>,
    onlyOnce?: boolean,
    baseFormPath?: string,
    form?: TForm,
    state?: TInputState
} 

/** Represents a selector for an observable slice of form and state  */
export interface FormStateObserverSelector<
    TInputState extends object,
    TReturnValue, 
    TStateSlice extends keyof TInputState> {
    stateSlice: TStateSlice[],
    setter: (state$: Observable<Partial<TInputState>>) => TReturnValue,
} 

/** Represents the selector function of form state {@link FormStateSetter} */
export type FormStateSelectorFn<TForm, TInputState, TReturnValue> = (
    form: TForm,
    state: TInputState, 
 ) => TReturnValue

/** Returns an object where all properties allow a form state selectors with respective return values */
export type AllowFormStateSelectors<
 TObject extends object,
 TForm extends object, 
 TInputState extends object
> = { 
    [P in keyof TObject]: P extends `${any}$` 
        ? FormStateSelector<DeepPartial<TForm>, Partial<TInputState>, TObject[P], string, keyof TInputState> | TObject[P] 
        : NotNull<TObject[P]> extends AsyncValidatorFn[] 
        ? (FormStateObserverSelector<Partial<TInputState>, AsyncValidatorFn, keyof TInputState> | AsyncValidatorFn)[]
        : TObject[P]
}

/** Represents a generic form state selector */
export type GenericFormStateSelector = FormStateSelector<object, any, any, string, any>

/** Represents a generic form state selector */
export type GenericFormStateObserverSelector = FormStateObserverSelector<any, any, any>

/** Describes a form that can render dynamically with the {@link DynamicFormComponent}
 *  Creates a reactive form with visible fields to change the values of the form. 
 *  @see {@link https://angular.io/guide/reactive-forms} */
export interface DynamicForm<
    TForm extends object, 
    TInputState extends object, 
    TControls extends ValidControlObject<TForm> = ValidControlObject<TForm>
> extends DynamicAbstractGroup<TForm, TInputState, TControls>,
          AllowFormStateSelectors<ControlOptions, TForm, TInputState> { } 

/** Represents a group of controls, and relationships between them. */
export interface DynamicAbstractGroup<
    TForm extends object, 
    TInputState extends object,
    TControls extends ValidControlObject<TForm>
> {
    /** The form controls that make up the group */
    controls: TControls
    /** Override control options statically or dynamically from state or form */
    overrides?: ControlOverridesMap<TForm, TInputState, TControls>
}

/** Represents a group of controls, and relationships between them. */
export interface DynamicControlGroup<
    TForm extends object, 
    TControls extends ValidControlObject<TForm>,
    TGroupComponent extends ControlGroupComponent<any> | null = null,
> extends DynamicAbstractGroup<TForm, never, TControls>, AllowFormStateSelectors<DynamicControlGroupOptions, TForm, never> {
    /** A control group component for displaying the group. 
     * @remarks Can only be null if default group is configured with {@link DYNAMIC_FORM_GLOBAL_OPTIONS} */
    viewComponent?: Type<TGroupComponent>,
    /** Configuration options for the group component */
    viewOptions: AllowFormStateSelectors<GetGroupComponentOptions<TGroupComponent>, TForm, never>
}

/** Represents a group of controls, and relationships between them. */
export interface DynamicControlArray<
    TTemplate extends ValidControl<any>,
    TArrayComponent extends ControlArrayComponent<any> | null = null,
> extends DynamicControlArrayOptions {
    /** A control group component for displaying the group. 
     * @remarks Can only be null if default group is configured with {@link DYNAMIC_FORM_GLOBAL_OPTIONS} */
    viewComponent?: Type<TArrayComponent>,
    /** The template control used for each entry */
    controlTemplate: TTemplate;
    /** Configuration options for the group component */
    viewOptions: GetArrayComponentOptions<TArrayComponent>    
    /** Override control options statically or dynamically from state or form */
    templateOverrides?: TTemplate extends DynamicControlGroup<(infer V), any, any>
        ? ControlOverrides<V, never, TTemplate> 
        : ControlOverrides<never, never, TTemplate>
}

/** Describes the rendering, value and validation of an form control field */
export interface DynamicControlField<
    TValueType, 
    TControlComponent extends ControlFieldComponent<TValueType,any>
> extends DynamicControlFieldOptions { 
    /** The control component that should be rendered */
    viewComponent: Type<TControlComponent> | null;
    /** The control component view configuration */
    viewOptions: GetOptionsFromComponent<TControlComponent>;
}

/** Represents configuration options for a dynamic control field */
export interface DynamicControlFieldOptions extends ControlOptions {
    /** Set to true if control is required. */
    required$?: boolean 
}
/** Represents configuration options for a dynamic control array */
export interface DynamicControlArrayOptions extends ControlOptions {}

/** Represents configuration options for a dynamic control group */
export interface DynamicControlGroupOptions extends ControlOptions {} 

/** Represents configuration options for all controls */
export interface ControlOptions {
    /** Set to true to require a value before the form can be submitted. Default is false. */
    disabled$?: boolean,     
    /** Validators for the control*/
    validators$?: ValidatorFn[],       
    /** Async validators for the control*/
    asyncValidators?: AsyncValidatorFn[],      
    /** A custom class added to the anchor tag of the control component */
    controlClass$?: string; 
}

/** Represents a control field component that displays a field used to set the control value. */
export interface ControlFieldComponent<TValueType, TViewOptions extends object> extends OnControlInit {
    /** The control accociated with the component */
    formControl: Maybe<GenericAbstractControl<TValueType>>;
    /** Selectors for viewOptions values. Use with {@link FormStateResolver} to retrieve observable values. */
    viewOptionSelectors: AllowFormStateSelectors<TViewOptions, any, any>;
    /** Selector for the required status of the control. Use with {@link FormStateResolver} to retrieve observable value. */
    requiredSelector?: boolean | FormStateSelector<any, any, boolean | undefined, string, any>;
    /** Resolve an observable for viewOptions values */
    resolveOptions$(): Observable<Immutable<TViewOptions>>;
}

/** Represents a control group component used to display a group of controls. */
export interface ControlGroupComponent<TViewOptions extends object> extends OnControlInit {
    /** The form group control accociated with the component */
    formGroup: FormGroup;
    /** Selectors for viewOptions values. Use with {@link FormStateResolver} to retrieve observable values. */
    viewOptionSelectors: AllowFormStateSelectors<TViewOptions, any, any>;
    /** The controls of the form group */
    controls: ValidControlObject<any>
}

/** Represents a control array component used to display an array of controls. */
export interface ControlArrayComponent<TViewOptions extends object> extends OnControlInit {
    /** The form array control accociated with the component */
    formArray: FormArray;
    /** Selectors for viewOptions values. Use with {@link FormStateResolver} to retrieve observable values. */
    viewOptionSelectors: AllowFormStateSelectors<TViewOptions, any, any>;
    /** The control template for creating entries in the form array */
    controlTemplate: ValidControl<any>
}

/** Represents a life cycle hook that runs when the control is initalized. */
export interface OnControlInit {
    onControlInit?: () => void
}

/** Represents an AbstractControl with generic value type */
export interface GenericAbstractControl<T> 
    extends Omit<AbstractControl, "valueChanges" | "reset" | "value" | "setValue" | "patchValue"> {

    readonly valueChanges: Observable<T>;

    reset(value?: T): void;

    readonly value: T;

    setValue(value: T, options?: Object): void;

    patchValue(value: T, options?: Object): void;
}

/** Represents component options for a default control group component configured with {@link DynamicFormDefaultOptions} 
 *  @remarks Use declaration merging to populate interface with options.
*/
export interface DefaultControlGroupComponentOptions {
    testOption$?: string
}

/** Represents component options for a default control array component configured with {@link DynamicFormDefaultOptions} 
 *  @remarks Use declaration merging to populate interface with options.
*/
export interface DefaultControlArrayComponentOptions {
    testOption$: string
};

/** Represents global configuration options for all dynamic forms in application. 
 *  @remarks Supplied with injection token {@link DYNAMIC_FORM_DEFAULT_OPTIONS} */
export interface DynamicFormDefaultOptions {
    arrayViewComponent?: Type<ControlArrayComponent<any>>;
    groupViewComponent?: Type<ControlGroupComponent<any>>;
    groupClass?: string;
    arrayClass?: string;
    fieldClass?: string;
}