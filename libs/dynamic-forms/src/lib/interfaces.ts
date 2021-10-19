import { Type } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { DeepPropsObject, DeepPropType, Immutable, Maybe, NotNull, MakeKeysOptionalIfOptionalObject } from 'global-types';
import { Observable } from 'rxjs';
import { DeepPartial } from 'ts-essentials';
import { DynamicHostDirective } from './dynamic-host.directive';

export type GetControlReturnValue<T> = T extends ControlComponent<(infer V), any> ? V : never;
export type GetOptionsFromComponent<T> = T extends ControlComponent<any, (infer Q)> ? Q : never;
export type GetGroupComponentOptions<T> = T extends ControlGroupComponent<(infer O)> ? O : DefaultControlGroupComponentOptions;

/** Represents a function that converts an error to a readable error message */
export type ErrorDisplayFn = (err: unknown) => string;

/** Represents a map of controls that should be disabled */
export type DisabledControls<TForm> = {[P in keyof NotNull<TForm>]: boolean };

/** Represents a map of controls with callbacks that are called on form value changes. Return true on callback to hide control. */
export type HideOnValueChanges<TForm> = {[P in keyof NotNull<TForm>]: (val: TForm) => boolean }

/** Represents an async validator that reacts to an observer of state T */
export type AsyncStateValidator<T> = ((state$: Observable<T>) => AsyncValidatorFn);

/** Represents a map of properties from TForm with an associated control */
export type ValidControlObject<TForm extends object> = {[P in keyof TForm]: ValidControl<TForm[P]> }

/** Represents a valid control for a given form */
export type ValidControl<TValueType> = 
        DynamicControl<TValueType, ControlComponent<TValueType, any>> | 
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
        TControls[P] extends DynamicControl<any, any>
            ? ControlOverrides<TForm, TInputState, TControls[P]>
        : TControls[P] extends DynamicControlGroup<any, any, any> 
            ? ControlGroupOverrides<TForm, TInputState, TControls[P]>
            : ControlOverrides<TForm, TInputState, any>
    
}>

/** Represents an object of configurable properties on TGroup, allowing form state selectors. */
export type ControlGroupOverrides<
    TForm extends object, 
    TInputState extends object, 
    TGroup extends DynamicControlGroup<any, any, any>
> = 
    AllowFormStateSelectors<Partial<DynamicGroupOptions>, TForm, TInputState> 
    & { 
        viewOptions?: AllowFormStateSelectors<Partial<TGroup["viewOptions"]>, TForm, TInputState> 
        overrides?: ControlOverridesMap<TForm, TInputState, TGroup["controls"]> 
    }

/** Represents an object of configurable properties on TControl, allowing form state selectors. */
export type ControlOverrides<
    TForm extends object, 
    TInputState extends object, 
    TControl extends DynamicControl<any,any>
> = 
    AllowFormStateSelectors<Partial<DynamicControlOptions>, TForm, TInputState>
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
> extends DynamicAbstractGroup<TForm, never, TControls>, AllowFormStateSelectors<DynamicGroupOptions, TForm, never> {
    /** A control group component for displaying the group. 
     * @remarks Can only be null if default group is configured with {@link DYNAMIC_FORM_GLOBAL_OPTIONS} */
    groupComponent?: Type<TGroupComponent>,
    /** Configuration options for the group component */
    viewOptions: AllowFormStateSelectors<GetGroupComponentOptions<TGroupComponent>, TForm, never>
}

/** Describes the rendering, value and validation of an form control */
export interface DynamicControl<
    TValueType, 
    TControlComponent extends ControlComponent<TValueType,any>
> extends DynamicControlOptions { 
    /** The control component that should be rendered */
    controlComponent: Type<TControlComponent> | null;
    /** The control component view configuration */
    viewOptions: GetOptionsFromComponent<TControlComponent>;
}

/** Represents configuration options for a dynamic control */
export interface DynamicControlOptions extends ControlOptions {
    /** Set to true if control is required. */
    required$?: boolean 
}

/** Represents configuration options for a dynamic control group */
export interface DynamicGroupOptions extends ControlOptions {} 

/** Represents configuration options for controls */
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

/** Represents a control component that displays a field used to set the control value. */
export interface ControlComponent<TValueType, TViewOptions extends object> extends OnControlInit {
    /** Selectors for viewOptions values. Use with {@link FormStateResolver} to retrieve observable values. */
    viewOptionSelectors: AllowFormStateSelectors<TViewOptions, any, any>;
    /** Selector for the required status of the control. Use with {@link FormStateResolver} to retrieve observable value. */
    requiredSelector?: boolean | FormStateSelector<any, any, boolean | undefined, string, any>;
    /** The control accociated with the component */
    control: Maybe<GenericAbstractControl<TValueType>>;
    /** Resolve an observable for viewOptions values */
    resolveOptions$(): Observable<Immutable<TViewOptions>>;
}

/** Represents a control group component used to display a group of controls. */
export interface ControlGroupComponent<TComponentConfig extends object> extends OnControlInit {
    dynamicHost: DynamicHostDirective;

    formGroup: FormGroup;

    config: DynamicControlGroup<any, any, ControlGroupComponent<TComponentConfig>>
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
export interface DefaultControlGroupComponentOptions { }

/** Represents global configuration options for all dynamic forms in application. 
 *  @remarks Supplied with injection token {@link DYNAMIC_FORM_DEFAULT_OPTIONS} */
export interface DynamicFormDefaultOptions {
    groupComponent?: Type<ControlGroupComponent<any>>;
    groupClass?: string;
    controlClass?: string;
}