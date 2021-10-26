import { Directive } from '@angular/core';
import { AllowFormStateSelectors, FormStateResolver, FormStateSelector, GenericAbstractControl, ControlFieldComponent } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { Observable } from 'rxjs';
import { _getValidationErrorMessage } from '../get-validation-error-message.helper';
import { ValidationErrorMap } from '../interfaces';
import { BaseFieldOptions } from './base-field-options.interface';


/** A base component class for implementing a control component. 
 *  Responsible for declaring the neccesary inputs & exposing state bindings. */
@Directive()
export abstract class BaseFieldComponent<TValueType, TOptions extends BaseFieldOptions>
    implements ControlFieldComponent<TValueType, TOptions> {

  formControl: GenericAbstractControl<TValueType>;

  viewOptionSelectors: Immutable<AllowFormStateSelectors<TOptions, any, any>>;

  requiredSelector?: Immutable<boolean | FormStateSelector<any, any, boolean | undefined, string, any>>;

  ɵviewOptions?: TOptions;
  
  constructor(
    private resolver: FormStateResolver,
    private validationErrorMessages?: ValidationErrorMap,
  ) {}

  getValidationErrorMessage(): Maybe<string> {
    return _getValidationErrorMessage(this.formControl?.errors, this.validationErrorMessages)
  } 

  resolveOptions$(): Observable<Immutable<TOptions>> {
    return this.resolver.resolveSlice$(this.viewOptionSelectors)
  }

  resolve$<T>(setter: Immutable<FormStateSelector<any, any, T, any, any> | T>): Observable<Immutable<T>> {
    return this.resolver.resolve$(setter)
  }

  resolveSlice$<T extends object>(setters: Immutable<AllowFormStateSelectors<T, any,any>>): Observable<Immutable<T>> {
    return this.resolver.resolveSlice$(setters)
  }
}