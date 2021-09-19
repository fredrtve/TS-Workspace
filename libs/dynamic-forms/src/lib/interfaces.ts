import { EventEmitter, Type } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DeepPropsObject, DeepPropType, Immutable, Maybe, NotNull, Prop } from 'global-types';
import { Observable } from 'rxjs';
import { DeepPartial } from 'ts-essentials';
import { DynamicAbstractGroupComponent } from './components/dynamic-abstract-group.component';

type ObjProps<T> = { [K in keyof T as T[K] extends Maybe<object> ? K : never]: NotNull<T[K]>; };

/** Represents a map of properties from TForm with an associated control */
export type ValidControlObject<TForm, TFormState extends object | null = null> = {[P in keyof TForm]: ValidControl<TForm, P, TFormState> }

/** Represents a function that converts an error to a readable error message */
export type ErrorDisplayFn = (err: unknown) => string;

/** Represents a map of validation errors with accociated {@link ErrorDisplayFn} 
 *  Provided with the token {@link VALIDATION_ERROR_MESSAGES} */
export interface ValidationErrorMap { [key: string]: ErrorDisplayFn }

/** Represents a map of controls that should be disabled */
export type DisabledControls<TForm> = {[P in keyof NotNull<TForm>]: boolean };

/** Represents a map of controls with callbacks that are called on form value changes. Return true on callback to hide control. */
export type HideOnValueChanges<TForm> = {[P in keyof NotNull<TForm>]: (val: TForm) => boolean }

/** Represents an async validator that reacts to an observer of state T */
export type AsyncStateValidator<T> = ((state$: Observable<T>) => AsyncValidatorFn);

/** Represents a valid control for a given form */
export type ValidControl<TForm, TProp extends keyof TForm = keyof TForm, TFormState extends object | null = null> = 
        DynamicControl<TForm[TProp], Partial<TFormState> | null> | 
        DynamicControlGroup<NotNull<TForm[TProp]> extends object ? NotNull<TForm[TProp]> : never, Partial<TFormState> | null>

type NotFound = "$$PROP_NOT_FOUND";

/** Check if the given properties TSlice are found on TForm, also searching in nested objects. */
export type ValidFormSlice<TForm, TSlice extends string> = keyof { 
    [ P in TSlice as DeepPropType<TForm, P, NotFound> extends NotFound ? NotFound  : never ]: true 
} extends never ? TSlice : never;  

/** Check if the given properties TSlice are found on TState, not searching in nested objects. */
export type ValidStateSlice<TState, TSlice extends string> = keyof { 
    [ P in TSlice as P extends keyof TState ? P : never]: true 
} 

/** Represents the setter function of a form state setter {@link FormStateSetter} */
export type FormStateSetterFn<TForm, TFormState, TInputState, TFormSlice extends string, TStateSlice extends string> = (
    form: DeepPropsObject<TForm, TFormSlice>,
    state: DeepPropsObject<TInputState, TStateSlice>, 
 ) => Partial<TFormState>

/** Represents a setter for a property on TFormState from TInputState & TForm */
export interface FormStateSetter<
    TForm extends object, 
    TFormState extends object | null, 
    TInputState extends object | null,
    TFormSlice extends string, 
    TStateSlice extends string> {
    formSlice: TFormSlice[],
    stateSlice: TStateSlice[],
    setter: FormStateSetterFn<TForm, TFormState, TInputState, TFormSlice, TStateSlice>,
    keepActive?: boolean
} 

/** Represents a generic form state setter */
export type GenericFormStateSetter = FormStateSetter<object, object | null, object | null, string, string> | object

/** Represents the setter function of a form state binding {@link FormStateBinding} */
export type FormStateBindingSetter<TState, TSlice extends string, TOutput> = (s: DeepPropsObject<TState, TSlice>) => TOutput 

/** Represents a generic form state binding */
export type GenericFormStateBinding = FormStateBinding<object, string, unknown> | unknown

/** Represents a setter for a given output with selected state as input */
export type FormStateBinding<TState, TSlice extends string, TOutput> = { 
    props: TSlice[], 
    setter: FormStateBindingSetter<TState, TSlice, TOutput>
}
 
/** Describes a form that can render dynamically with the {@link DynamicFormComponent}
 *  Creates a reactive form with visible fields to change the values of the form. 
 *  @see {@link https://angular.io/guide/reactive-forms} */
export interface DynamicForm<
    TForm extends object, 
    TFormState extends object | null, 
> extends DynamicAbstractGroup<TForm, TFormState> {
    /** A function that modifies the form value when submitted. Use helper function {@link _formStateSetter} for dynamic state, or provide statically.*/
    onSubmitFormatter?: (f: TForm, s: Immutable<Partial<TFormState>>) => Immutable<TForm>;
    /** A map of state setters for TFormState. */
    formStateSetters?: (object | Partial<TFormState>)[]  
    /** Set to true if the form should have a reset option */
    resettable?: boolean;
    /** The form value that will be set on reset */
    resetState?: Partial<TForm>;
    /** Should the form require the user to be online before submitting? */
    submitText?: string;
    /** Customization options */
    options?: DynamicFormOptions
}   

/** Describes a group of controls that make up an object in the form model */
export interface DynamicControlGroup<
    TValueType extends object, 
    TFormState extends object | null = null> extends DynamicAbstractGroup<TValueType, TFormState>{
    /** A custom control group component for displaying the group */
    controlGroupComponent?: Type<DynamicAbstractGroupComponent<DynamicControlGroup<TValueType, TFormState>>>,
    /** A visual label displayed above the group on the rendered form */
    label?: string,
}

/** Describes a group of controls. */
export interface DynamicAbstractGroup<TForm, TFormState extends object | null = null> {
    /** The form controls that make up the group */
    controls: ValidControlObject<TForm, TFormState>
    /** Validators for the form group */
    validators?: ValidatorFn[];
    /** A map of controls with a function that runs on form value changes that decides if control should be hidden. */
    hideOnValueChangeMap?: HideOnValueChanges<Partial<TForm>>;
    /** A map of controls that should be disabled by default */
    disabledControls?: DisabledControls<Partial<TForm>>;
    /** A custom class added to the anchor tag of the group */
    panelClass?: string; 
}

/** Describes the rendering, value and validation of an form control */
export interface DynamicControl<
    TValueType, 
    TFormState extends object | null = null, 
    TQuestion extends Question<object | null, Partial<TFormState>> = Question<object | null, Partial<TFormState>>> { 
    /** The question component that should be rendered */
    questionComponent: Type<QuestionComponent<object | null, Partial<TFormState>, TQuestion>> | null;
    /** The question component view configuration */
    question?: TQuestion;
    /** Set to true to require a value before the form can be submitted */
    required?: boolean, 
    /** A custom function for formatting the initial value before setting control. */      
    valueFormatter?: ((value: Maybe<Immutable<TValueType>>) => Maybe<TValueType>),
    /** Validators for the control value */
    validators?: ValidatorFn[],
    /** Async state validators for the control value  */
    asyncStateValidators?: AsyncStateValidator<Maybe<Partial<TFormState>>>[],
    /** A custom class added to the anchor tag of the question component */
    panelClass?: string; 
}

 /** Describes the data required to display a question in the form */
export interface Question<TBindings extends object | null = null, TFormState extends object | null = null> {
    /** A placeholder value for the field */
    placeholder?: string;
    /** A label describing the field */
    label?: string;
    ariaLabel?: string;
    /** A hint helping the user fill out the field */
    hint?: string;
    /** The color theme of the field */
    color?: "primary" | "accent";
    /** The width of the field. Use css syntax. */
    width?: string;
    /** Bindings to form state */
    stateBindings?: {[P in keyof Partial<TBindings>]: FormStateBinding<TFormState, Prop<TFormState>, TBindings[P]> | TBindings[P] }
}

/** Represents a map of bound state */
export type StateBindingsMap<TBindings> = { [P in keyof Partial<TBindings>]: Observable<TBindings[P]>; } 

/** Represents a question component used to display a field to set a form control value. */
export interface QuestionComponent<
    TBindings extends object | null = null, 
    TFormState extends object | null = null,
    TQuestion extends Question<TBindings, TFormState> = Question<TBindings, TFormState> > {
    /** The question component view configuration */
    question: Immutable<TQuestion>;
    /** Set to true to indicate the question is required. */
    required?: boolean;
    /** The control accociated with the question */
    control: Maybe<AbstractControl>;
    /** An observable emitting true if the question field should be hidden */
    hideField$: Observable<boolean>;
    /** Bindings to form state */
    stateBindings: StateBindingsMap<TBindings>
}

/** Represents a form component. Implemented by {@link DynamicForm} */
export interface FormComponent<TConfig, TForm, TFormState, TResult = Immutable<TForm>> {
    /** The form configuration object */
    config: Immutable<Maybe<TConfig>>;
    /** The initial value of the form */
    initialValue: Immutable<DeepPartial<TForm>>
    /** The form state shared by the controls of the form */
    inputState: Maybe<Immutable<TFormState>>;
    /** An event emitter that emits the form value when the user submits the form*/
    formSubmitted: EventEmitter<Maybe<TResult>>;
}

/** Represents different options for customizing form behaviour */
export interface DynamicFormOptions {
    /** Should the form require the user to be online before submitting? */
    onlineRequired?: boolean;
    /** Can the form submit in pristine state? */
    allowPristine?: boolean;    
    /** Set to true to get the raw form value on submit. 
     * This includes the values of disabled controls. */
    getRawValue?: boolean;
    /** Set to true if disabled controls shouldn't be rendered. */
    noRenderDisabledControls?: boolean;    
    /** If true, all controls with an initial value are disabled */
    disableControlsWithValue?: boolean
}
