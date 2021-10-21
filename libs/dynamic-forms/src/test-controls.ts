import { Directive } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Immutable, Maybe } from 'global-types';
import { Observable } from 'rxjs';
import { AllowFormStateSelectors, ControlArrayComponent, ControlFieldComponent, ControlGroupComponent, DynamicControlArray, DynamicControlGroup, FormStateSelector, GenericAbstractControl } from './lib/interfaces';
import { FormStateResolver } from './lib/services/form-state.resolver';
import { DynamicFormBuilder, DynamicHostDirective } from './public-api';

/** A base component class for implementing a control component. 
 *  Responsible for declaring the neccesary inputs & exposing state bindings. */
@Directive()
export abstract class BaseFieldComponent<TValueType, TQuestion extends BaseQuestion>
    implements ControlFieldComponent<TValueType, TQuestion> {

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
export class InputFieldComponent extends BaseFieldComponent<string, InputQuestion> implements ControlFieldComponent<string, InputQuestion> {
  
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

export interface TestControlGroupOptions { someOption$: string } ;
@Directive()
export class TestControlGroupComponent implements ControlGroupComponent<TestControlGroupOptions> {
  dynamicHost: DynamicHostDirective;

  formGroup: FormGroup;

  config: DynamicControlGroup<any, any, ControlGroupComponent<TestControlGroupOptions>>;

  constructor() {}
}
export interface TestControlArrayOptions { someOption$: string } ;
@Directive()
export class TestControlArrayComponent implements ControlArrayComponent<TestControlArrayOptions> {
  dynamicHost: DynamicHostDirective;

  formArray: FormArray;

  config: DynamicControlArray<any, ControlArrayComponent<TestControlArrayOptions>>;

  constructor() {}
}

  const builder = new DynamicFormBuilder<{ arr: { nest1: string, nest2: string}[], fun: string}>();
  const iBuilder = new DynamicFormBuilder<{ nest1: string, nest2: string}>();

  const stringControl = builder.field({
    viewComponent: InputFieldComponent,
    viewOptions: { width$: "" }
  });

  const group = builder.group<{ nest1: string, nest2: string}>()({
    controls: {
      nest1: stringControl,
      nest2: stringControl
    },
    viewOptions: { },
    overrides: {
      nest1: { disabled$: iBuilder.bindForm("nest1", (arr) => true) }
    }
  });

  const arr = builder.array({
    viewComponent: TestControlArrayComponent,
    controlTemplate: group,
    viewOptions: { someOption$: " " },
    templateOverrides: {
      disabled$: iBuilder.bindForm("nest1", (arr) => true)
    }
  })

  const form = builder.form({
    controls: {
      fun: stringControl,
      arr: arr
    },
    overrides: {
      arr:{
        viewOptions: { someOption$: builder.bindForm("fun") }
      }
    }
  })