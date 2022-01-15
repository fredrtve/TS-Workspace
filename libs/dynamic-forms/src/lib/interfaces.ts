import { Type } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DeepPropsObject, Immutable, Maybe, NotNull } from '@fretve/global-types';
import { Observable } from 'rxjs';
import { DeepPartial } from 'ts-essentials';

export type GetControlFieldReturnValue<T> = T extends ControlFieldComponent<(infer V), any> ? V : never;
export type GetViewOptionsFromComponent<T, Else = never> = T extends null ? {} : T extends Type<ControlComponent<any, (infer Q)>> ? Q : Else;
export type GetValueTypeFromControl<T> = T extends AbstractDynamicControl<any, any, (infer V), any,any> ? V : never;
export type GetViewOptionsFromControl<T> = T extends AbstractDynamicControl<any, any, any, (infer C), (infer D)> ? GetViewOptionsFromComponent<C, D> : never;

/** Represents a function that converts an error to a readable error message */
export type ErrorDisplayFn = (err: unknown) => string;

/** Represents a map of controls that should be disabled */
export type DisabledControls<TForm> = {[P in keyof NotNull<TForm>]: boolean };

/** Represents a map of controls with callbacks that are called on form value changes. Return true on callback to hide control. */
export type HideOnValueChanges<TForm> = {[P in keyof NotNull<TForm>]: (val: TForm) => boolean }

/** Represents an async validator that reacts to an observer of state T */
export type AsyncStateValidator<T> = ((state$: Observable<T>) => AsyncValidatorFn);

export type FormControlType<TControl> =  
    TControl extends DynamicControlArray<any,any,any,any,any> ? FormArray 
    : TControl extends DynamicControlGroup<any,any,any,any,any> ? FormGroup
    : TControl extends DynamicControlField<any, any, (infer ValueType), any> ? (GenericAbstractControl<ValueType> & FormControl) 
    : FormControl

/** Represents a selector for a slice of form and state */
export interface FormStateSelector<
    TForm extends object, 
    TInputState extends object,
    TReturnValue, 
    TFormSlice extends string, 
    TStateSlice extends keyof TInputState> extends ReactiveSelector<TFormSlice, TStateSlice> {
    setter: FormStateSelectorFn<DeepPropsObject<TForm, TFormSlice>, Partial<TInputState>, TReturnValue | Observable<TReturnValue>>;
    selectorType: "regular";
    options?: FormStateSelectorOptions,
    ɵform?: TForm,
    ɵstate?: TInputState
} 

/** Represents configuration options for an {@link FormStateSelector} */
export interface FormStateSelectorOptions {
    /** Only emit value once */
    onlyOnce?: boolean;
    /** Only emit unique values. Defaults to true */
    distinct?: boolean;
}

/** Represents a selector for an observable slice of form and state  */
export interface FormStateObserverSelector<
    TForm extends object, 
    TInputState extends object,
    TReturnValue, 
    TFormSlice extends string, 
    TStateSlice extends keyof TInputState> extends ReactiveSelector<TFormSlice, TStateSlice> {
    setter: FormStateSelectorFn<Observable<DeepPropsObject<TForm, TFormSlice>>, Observable<Partial<TInputState>>, Observable<TReturnValue>>;
    selectorType: "observer";
    ɵform?: TForm,
    ɵstate?: TInputState,
} 

/** Represents a selector for async validators */
export interface AsyncValidatorSelector<
    TForm extends object, 
    TInputState extends object,
    TFormSlice extends string, 
    TStateSlice extends keyof TInputState> extends ReactiveSelector<TFormSlice, TStateSlice> {
    setter: FormStateSelectorFn<Observable<DeepPropsObject<TForm, TFormSlice>>, Observable<Partial<TInputState>>, AsyncValidatorFn>;
    selectorType: "asyncValidator"
    ɵform?: TForm,
    ɵstate?: TInputState,
} 

/** Represents a generic reactive selector */
export interface ReactiveSelector<TFormSlice extends string, TStateSlice extends string | number | symbol> {
    stateSlice: TStateSlice[],
    formSlice: TFormSlice[],
    setter: FormStateSelectorFn<any,any,any>,
    baseFormPath?: string,
}

/** Represents the selector function of form state {@link FormStateSetter} */
export type FormStateSelectorFn<TForm, TInputState, TReturnValue> = (
    form: TForm,
    state: TInputState, 
 ) => TReturnValue

/** A union of eligible form state selectors  */
export type AllowedFormStateSelector<TValueType, TForm extends object, TInputState extends object> = 
    FormStateSelector<DeepPartial<TForm>, Partial<TInputState>, TValueType, string, keyof TInputState> | 
    FormStateObserverSelector<DeepPartial<TForm>, Partial<TInputState>, TValueType, string, keyof TInputState> | 
    TValueType;

/** Returns an object where all properties allow a form state selectors with respective return values */
export type AllowFormStateSelectors<
 TObject extends object,
 TForm extends object, 
 TInputState extends object
> = { 
    [P in keyof TObject]: P extends `${any}$` 
        ? FormStateSelector<DeepPartial<TForm>, Partial<TInputState>, TObject[P], string, keyof TInputState> | 
          FormStateObserverSelector<DeepPartial<TForm>, Partial<TInputState>, TObject[P], string, keyof TInputState> | 
          TObject[P] 
        : NotNull<TObject[P]> extends AsyncValidatorFn[] 
        ? (AsyncValidatorSelector<DeepPartial<TForm>, Partial<TInputState>, string, keyof TInputState> | AsyncValidatorFn)[]
        : TObject[P]
}

/** Returns an object with no form state selectors */
export type RemoveFormStateSelectors<TObject extends object> = { 
    [P in keyof TObject]: Exclude<TObject[P], FormStateSelector<any, any, any, string, any>>
}

/** Represents a generic form state selector */
export type GenericFormStateSelector = FormStateSelector<object, any, any, string, any>

/** Represents a generic form state selector */
export type GenericFormStateObserverSelector = FormStateObserverSelector<object, any, any, string, any>

/** Represents a map of properties from TForm with an associated control schema */
export type DynamicControlMap<TForm extends object, TInputState extends object> = { 
    [P in keyof TForm]: 
        AbstractDynamicControl<TForm,  TInputState, any, Maybe<Type<ControlComponent<any, any>>>, any> 
}

export interface DynamicControlGroup<
    TForm extends object,
    TInputState extends object,
    TValueType extends object,
    TControls extends DynamicControlMap<TValueType, TInputState>,
    TGroupComponent extends Maybe<Type<ControlGroupComponent<TValueType, any>>>,
> extends AbstractDynamicControl<TForm, TInputState, TValueType, TGroupComponent, DefaultControlGroupComponentOptions>,
          AllowFormStateSelectors<DynamicControlGroupOptions, TForm, TInputState> {
    /** The form controls that make up the group */
    controls: TControls
}

export interface DynamicControlArray<
    TForm extends object,
    TInputState extends object,
    TValueType,
    TTemplate extends AbstractDynamicControl<TForm, any, TValueType, any, any>,
    TControlComponent extends Type<ControlArrayComponent<TValueType, any>> | undefined = undefined, 
> extends AbstractDynamicControl<TForm, TInputState, TValueType[], TControlComponent, DefaultControlArrayComponentOptions>,
          AllowFormStateSelectors<DynamicControlArrayOptions, TForm, TInputState> {
     /** The template control used for each entry */
    controlTemplate: TInputState extends ControlState<TTemplate> ? TTemplate : never;       
}

type ControlState<T> = T extends AbstractDynamicControl<any, (infer S), any, any,any> ? S : never;

export interface DynamicControlField<
    TForm extends object,
    TInputState extends object,
    TValueType,
    TControlComponent extends Type<ControlComponent<TValueType, any>> | undefined = undefined
> extends AbstractDynamicControl<TForm, TInputState, TValueType, TControlComponent, never>,
          AllowFormStateSelectors<DynamicControlFieldOptions, TForm, TInputState> {}

export interface AbstractDynamicControl<
    TForm extends object,
    TInputState extends object,
    TValueType,
    TControlComponent extends Maybe<Type<ControlComponent<TValueType, any>>> = undefined, 
    TViewOptionDefault extends object = never,
> {
      /** The control component that should be rendered.
       * @remarks 
       * For arrays and groups; a value of undefined indicates the use of default component. 
       * For groups; a value of null indicates no component
       */
      viewComponent?: TControlComponent;
      /** The control component view options */
      viewOptions: AllowFormStateSelectors<GetViewOptionsFromComponent<TControlComponent, TViewOptionDefault>, TForm, TInputState>;
      ɵvalueType?: TValueType,
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
    /** Clears the control value if true. Ignores initial value.  */
    clearValue$?: boolean;
}

/** Represents a control field component that displays a field used to set the control value. */
export interface ControlFieldComponent<TValueType, TViewOptions extends object> 
    extends ControlComponent<TValueType, TViewOptions> {
    /** The control accociated with the component */
    formControl: GenericAbstractControl<TValueType>;
    /** Selector for the required status of the control. Use with {@link FormStateResolver} to retrieve observable value. */
    requiredSelector?: Immutable<AllowedFormStateSelector<boolean | undefined, any, any>>;
    /** Resolve an observable for viewOptions values */
    resolveOptions$(): Observable<Immutable<TViewOptions>>;
}

/** Represents a control group component used to display a group of controls. */
export interface ControlGroupComponent<TValueType extends object, TViewOptions extends object> 
    extends ControlComponent<TValueType, TViewOptions> {
    /** The form group control accociated with the component */
    formControl: FormGroup;
    /** The controls of the form group */
    controls: Immutable<DynamicControlMap<any, any>>
}

/** Represents a control array component used to display an array of controls. */
export interface ControlArrayComponent<TValueType extends any, TViewOptions extends object> 
    extends ControlComponent<TValueType[], TViewOptions> {
    /** The form array control accociated with the component */
    formControl: FormArray;
    /** The control template for creating entries in the form array */
    controlTemplate: Immutable<AbstractDynamicControl<any, any, TValueType, any, any>>
}

export interface ControlComponent<TValueType, TViewOptions extends object> extends OnControlInit {
    /** The control associated with this component */
    formControl: GenericAbstractControl<TValueType>;
    /** Selectors for viewOptions values. Use with {@link FormStateResolver} to retrieve observable values. */
    viewOptionSelectors: Immutable<AllowFormStateSelectors<TViewOptions, any, any>>
    ɵviewOptions?: TViewOptions
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

/** Represents component options for a default control array component configured with {@link DynamicFormDefaultOptions} 
 *  @remarks Use declaration merging to populate interface with options.
*/
export interface DefaultControlArrayComponentOptions { };

/** Represents a custom html attribute for a given control */
export interface CustomAttribute<TControl extends AbstractDynamicControl<any,any,any,any,any> = AbstractDynamicControl<any,any,any,any,any>> {
    attribute: string, 
    value: (name: string, config: TControl) => string 
}

/** Represents default configuration options for all dynamic forms in module scope. 
 *  @remarks Supplied with injection token {@link DYNAMIC_FORM_DEFAULT_OPTIONS} */
export interface DynamicFormDefaultOptions {
    arrayViewComponent?: Type<ControlArrayComponent<any, any>>;
    groupViewComponent?: Type<ControlGroupComponent<any, any>>;
    groupClass?: string;
    arrayClass?: string;
    fieldClass?: string;
    controlAttributes?: CustomAttribute[]
}