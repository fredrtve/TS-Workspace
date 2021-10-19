import { Directive } from '@angular/core';
import { Immutable, Maybe } from 'global-types';
import { Observable } from 'rxjs';
import { AllowFormStateSelectors, ControlComponent, FormStateSelector, GenericAbstractControl } from './lib/interfaces';
import { FormStateResolver } from './lib/services/form-state.resolver';

/** A base component class for implementing a control component. 
 *  Responsible for declaring the neccesary inputs & exposing state bindings. */
@Directive()
export abstract class BaseControlComponent<TValueType, TQuestion extends BaseQuestion>
    implements ControlComponent<TValueType, TQuestion> {

  control: Maybe<GenericAbstractControl<TValueType>>;

  viewOptionSelectors: AllowFormStateSelectors<TQuestion, any, any>;

  requiredSelector?: boolean | FormStateSelector<any, any, boolean | undefined, string, any>;

  viewOptions?: Immutable<TQuestion>;
  
  constructor(
    private resolver: FormStateResolver,
  ) {}

  resolveOptions$(): Observable<Immutable<TQuestion>> {
    return this.resolver.resolveSlice$(this.viewOptionSelectors)
  }

  resolve$<T>(setter: FormStateSelector<any, any, T, any, any> | T): Observable<Immutable<T>> {
    return this.resolver.resolve$(setter)
  }

  resolveSlice$<T extends object>(setters: AllowFormStateSelectors<T, any,any>): Observable<Immutable<T>> {
    return this.resolver.resolveSlice$(setters)
  }
}
/** Describes the data required to display a control in the form */
export interface BaseQuestion {
  /** A placeholder value for the field */
  placeholder$?: string;
  /** A label describing the field */
  label$?: string;
  ariaLabel$?: string;
  /** A hint helping the user fill out the field */
  hint$?: string;
  /** The color theme of the field */
  color$?: "primary" | "accent";
  /** The width of the field. Use css syntax. */
  width$: string;
}

export interface InputQuestion extends BaseQuestion {
    type$?: "tel" | "text" | "number" | "email" | "file" | "password";
    hideable$?: boolean;
    defaultHidden$?: boolean;
    resetable$?: boolean;
    autoComplete$?: "on" | "off" | "new-password"
  }
  
type ViewModel = InputQuestion & { required?: boolean }

@Directive()
export class InputControlComponent extends BaseControlComponent<string, InputQuestion> implements ControlComponent<string, InputQuestion> {
  
    hideField: Maybe<boolean>;
  
    vm$: Observable<ViewModel>;
  
    constructor(
      resolver: FormStateResolver,
    ) { 
        super(resolver);
    }
  
    ngOnInit(){
      this.vm$ = this.resolveSlice$<ViewModel>({...this.viewOptionSelectors });
    }
  
  }