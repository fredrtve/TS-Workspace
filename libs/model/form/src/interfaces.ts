import { DynamicForm } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { RelationInclude, StateModels, StatePropByModel } from 'model/core';
import { Observable } from 'rxjs';
import { StateAction } from 'state-management';

/** Represents a function that converts a form value to a state action */
export type Converter<TInput, TOutput> = (input: Immutable<TInput>) => Immutable<TOutput>;

/** The input value passed to converters by the model form when form is submitted.  */
export interface ModelFormResult<
    TState extends object, 
    TModel extends StateModels<TState>,
    TForm = TModel,
> {
    /** The actual value of the form */
    formValue: TForm,
    /** Any options used in the form */
    options?: Maybe<Partial<TState>>,
    /** The state property corresponding with the model */
    stateProp: StatePropByModel<TState, TModel>
}

/** Represents a configuration object for a model form */
export interface ModelFormConfig<
    TState extends object, 
    TModel extends StateModels<TState>,
    TForm extends object = TModel extends object ? TModel : object, 
    TFormState extends object | null = null>
{    
    /** The form being used */
    dynamicForm: DynamicForm<TForm, TFormState extends null ? TState : TState & TFormState>;
    /** Configure what relational state that will be mapped to entity and included in form state. */
    includes: RelationInclude<TState, TModel>
    /** A custom converter used to convert form to a state action on submit. 
     *  Defaults to {@link _formToSaveModelConverter} with form value as entity.  */
    actionConverter?: Converter<ModelFormResult<TState, TModel, TForm>, StateAction>
    /** A custom converter used to convert the model data to form. Only required on edit. If null, form value is treated as model */
    modelConverter?: Maybe<Converter<TModel, Partial<TForm>>>
}

/** Represents a configuration object for the model form service. */
export interface ModelFormServiceOptions<TInputState = object, TForm extends object = object> {
    /** Additional form state that should be merged with model state */ 
    formState?: Immutable<TInputState> | Observable<Immutable<TInputState>>,
    /** If set to false, the delete option will not be displayed. */
    deleteDisabled?: boolean, 
    /** A custom title for the form sheet. */
    customTitle?: string, 
    /** Set to true for full screen form. Default is true. */
    fullScreen?: boolean,  
    /** Enable to append a query param to the route when opened, making the form a part of the browser history. 
     *  Default is true */
    useRouting?: boolean
    /** A callback that gets executed when form is submitted. */
    submitCallback?: (val: Immutable<TForm>) => void
  }
