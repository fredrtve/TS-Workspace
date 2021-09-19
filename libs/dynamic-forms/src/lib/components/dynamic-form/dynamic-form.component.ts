import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Inject, Input, Optional, Output, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Immutable, Maybe } from 'global-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, first, map, startWith, tap } from 'rxjs/operators';
import { DeepPartial } from 'ts-essentials';
import { DynamicFormFactory } from '../../dynamic-form.factory';
import { DynamicFormStore } from '../../dynamic-form.store';
import { DynamicHostDirective } from '../../dynamic-host.directive';
import { _getValidationErrorMessage } from '../../helpers/get-validation-error-message.helper';
import { _hasSameState } from '../../helpers/has-same-state.helper';
import { VALIDATION_ERROR_MESSAGES } from '../../injection-tokens.const';
import { DynamicForm, FormComponent, ValidationErrorMap } from '../../interfaces';
import { DynamicAbstractGroupComponent } from '../dynamic-abstract-group.component';
import { DynamicControlGroupComponent } from '../dynamic-control-group.component';

/** Responsible for rendering a dynamic form with a {@link DynamicForm} configuration. */
@Component({
  selector: 'lib-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynamicFormStore, DynamicFormFactory],
})
export class DynamicFormComponent<TForm extends object, TFormState extends object | null>
    extends DynamicAbstractGroupComponent<DynamicForm<TForm, TFormState>> 
    implements FormComponent<DynamicForm<TForm, TFormState>, TForm, Partial<TFormState>, Immutable<TForm>> {
        
    @ViewChild(DynamicHostDirective, {static: true}) dynamicHost: DynamicHostDirective;

    private initialValueSubject = new BehaviorSubject<Immutable<Partial<TForm>> | null>(null);
    initialValue$ = <Observable<Immutable<Partial<TForm>>>> this.initialValueSubject.asObservable().pipe(filter(x => x !== null), first())

    @Input('inputState') 
    set inputState(value: Maybe<Immutable<Partial<TFormState>>>) {
        if(value) this.formStore.setInputState(value)
    }

    @Input('initialValue') 
    set initialValue(value: Immutable<DeepPartial<TForm>>) {
        if(value) this.initialValueSubject.next(value)
    }

    get config(): Immutable<DynamicForm<TForm, TFormState>> { return this._config }
    @Input('config') 
    set config(value: Immutable<DynamicForm<TForm, TFormState>>) {
        this._config = value;
        this.formOptions = value.options || {};
        this.initalizeForm();
    }

    @Output() formSubmitted = new EventEmitter<Maybe<Immutable<TForm>>>();

    resetEnabled$: Observable<boolean>;

    constructor(
        componentFactoryResolver: ComponentFactoryResolver,
        cdRef: ChangeDetectorRef,
        formFactory: DynamicFormFactory,
        renderer: Renderer2,
        private formStore: DynamicFormStore<TFormState>,
        @Inject(VALIDATION_ERROR_MESSAGES) @Optional() private validationErrorMessages?: ValidationErrorMap,
    ) { 
        super(componentFactoryResolver, cdRef, DynamicControlGroupComponent, formFactory, renderer);     
    }

    onSubmit(){
        let value = this.formOptions.getRawValue ? this.formGroup.getRawValue() : this.formGroup.value;
        if(this.config.onSubmitFormatter)
            value = this.config.onSubmitFormatter(value, this.formStore.formState || {});
            
        this.formGroup.markAsPristine();
        this.formSubmitted.emit(value);
    }

    onCancel(){
        this.formSubmitted.emit(null);
    }

    onReset(){
        this.formGroup.reset(this.config.resetState || {});
        this.formGroup.markAsDirty()
    }
    
    getValidationErrorMessage(): Maybe<string>{
        return _getValidationErrorMessage(this.formGroup.errors, this.validationErrorMessages)
    }

    private initalizeForm(): void {
        this.formGroup = new FormGroup({});  

        if(this.config.resettable)
            this.resetEnabled$ = this.formGroup.valueChanges.pipe(
                debounceTime(50),
                startWith(true),
                map(x => !_hasSameState(this.formGroup.value, this.config.resetState)),
            )

        this.initalize(); 
        this.cdRef.markForCheck();

        this.initialValue$.pipe(tap(x => {
            this.formGroup.patchValue(x);
        })).subscribe();

        this.formStore.initalizeFormState(this.formGroup, <any> this.config.formStateSetters) 
    }
}
