import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Immutable, Maybe, Prop, UnknownState } from 'global-types';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DynamicFormStore } from '../dynamic-form.store';
import { _getValidationErrorMessage } from '../helpers/get-validation-error-message.helper';
import { Question, QuestionComponent, StateBindingsMap, ValidationErrorMap } from '../interfaces';
import { selectState } from '../select-state.operator';
import { _isFormStateBinding } from '../type.helpers';

/** A base component class for implementing a question component. 
 *  Responsible for declaring the neccesary inputs & exposing state bindings. */
@Directive()
export abstract class BaseQuestionComponent<TBindings extends object | null, TQuestion extends Question<TBindings, object | null>>
    implements QuestionComponent<TBindings, object | null> {

  @HostBinding('style.width') width: string;

  control: Maybe<AbstractControl>;
  required: boolean;
  hideField$: Observable<boolean>;

  stateBindings:  StateBindingsMap<TBindings> = <StateBindingsMap<TBindings>> {};

  private _question: Immutable<TQuestion>;
  get question(): Immutable<TQuestion> { return this._question; }

  @Input() set question(value: Immutable<TQuestion>) {
      this._question = value;
      this.onQuestionChanges(value);  
  }

  constructor(
    private validationErrorMessages: ValidationErrorMap,
    private formStore: DynamicFormStore<object | null>
  ) {}

  /** Responsible for getting the validation error message based on errors on the control */
  getValidationErrorMessage(): Maybe<string> {
    return _getValidationErrorMessage(this.control?.errors, this.validationErrorMessages)
  } 

  /** Gets called when the @Input() question changes. */
  protected onQuestionChanges(question: Immutable<TQuestion>): void {
    this.setBindings(<TQuestion> question); 
    this.width = question.width || "100%"   
  }

  private setBindings(question: TQuestion){
    if(!question.stateBindings) return;
    for(const prop in question.stateBindings){
      const binding = question.stateBindings[prop];
      this.stateBindings[<Prop<StateBindingsMap<TBindings>>> prop] = _isFormStateBinding(binding) ?
        <any> this.formStore.formState$.pipe(selectState<UnknownState>(binding.props), map(binding.setter), 
          catchError(x => { console.error(x); return throwError(x)})) :
        of(binding);
    }
  }

}
