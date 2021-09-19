import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicForm, FormComponent } from 'dynamic-forms';
import { Immutable, Maybe } from 'global-types';
import { StateModels, _getModelConfig, ModelContext, RelationInclude } from 'model/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DeepPartial } from 'ts-essentials';
import { _formToSaveModelConverter } from './form-to-save-model-converter.helper';
import { ModelFormConfig } from './interfaces';
import { ModelFormFacade } from './model-form.facade';

@Component({
    selector: 'app-model-form',
    template: `
      <lib-dynamic-form 
        [config]="config.dynamicForm" 
        [initialValue]="initialValueMerged$ | async"
        [inputState]="inputState$ | async" 
        (formSubmitted)="$event ? onSubmit($event) : onCancel()">
      </lib-dynamic-form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelFormComponent<
  TState extends object, 
  TModel extends StateModels<TState>,
  TForm extends object, 
  TFormState extends object | null
>
  implements FormComponent<ModelFormConfig<TState, TModel, TForm, TFormState>, TForm, TFormState>{
    @Output() formSubmitted = new EventEmitter<Maybe<Immutable<TForm>>>()

    @Input() config: Immutable<ModelFormConfig<TState, TModel, TForm, TFormState>>;

    @Input() initialValue: Immutable<DeepPartial<TForm>>;

    @Input('inputState')
    set inputState(value: Maybe<Immutable<TFormState>>) {
      if(value) this.inputStateSubject.next(value)
    }

    private inputStateSubject = new BehaviorSubject(<Immutable<TFormState>> {})

    inputState$: Observable<Immutable<TFormState>>;

    formConfig$: Observable<Immutable<DynamicForm<TForm, TFormState>>>;

    initialValueMerged$: Observable<Immutable<Partial<TForm>>>;

    entityId: unknown;

    private isCreateForm: boolean = false;
  
    constructor(private facade: ModelFormFacade<TState, TModel>) {}
  
    ngOnInit(): void { 
      if(!this.config) return

      this.entityId = (<any> this.initialValue)?.[_getModelConfig(this.config.includes.prop).idProp];

      this.facade.loadModels(this.config.includes); 

      if(!this.entityId) this.isCreateForm = true;
      
      this.inputState$ = combineLatest([
        this.inputStateSubject.asObservable(),
        this.facade.getModelState$(this.config.includes)
      ]).pipe(
        map(([inputState, modelState]) => { return {...inputState, ...modelState} }), 
      );

      this.initialValueMerged$ = 
        this.facade.getModelState$(this.config.includes).pipe(first(), map(x => this.getInitialValueMerged(x)))
    }

    onSubmit(result: Immutable<TForm>): void{   
      this.formSubmitted.emit(result);

      setTimeout(() => {
        const converter = this.config!.actionConverter || _formToSaveModelConverter

        this.inputState$.pipe(first()).subscribe(state =>
          this.facade.save(converter({
            formValue: result, 
            options: <any> state,
            stateProp: <never> this.config!.includes.prop
          }))
        ) 
      }) 
    }

    onCancel = (): void => this.formSubmitted.emit(null); 

    private getInitialValueMerged(state: Maybe<Immutable<Partial<TState>>>): Immutable<Partial<TForm>> {
      let modelValue: Maybe<Immutable<Partial<TForm>>> = null;

      if(this.entityId && state){
        const model = state ? this.getModel(state, this.entityId, this.config!.includes) : null;
        if(model) modelValue = this.config!.modelConverter! ? this.config!.modelConverter(model) : <Immutable<TForm>> model;
      }

      return !modelValue ? 
        (this.initialValue || {}) : {...this.initialValue, ...modelValue}
    }

    private getModel(    
      state: Immutable<Partial<TState>>,
      id: unknown,   
      include: Immutable<RelationInclude<TState, TModel>>
    ): Immutable<TModel> | null {
      const { idProp } = _getModelConfig(include.prop);
      const query = new ModelContext<TState>().get(<any> include.prop).where(x => (<any> x)[idProp] === id);
      if(include.includes?.length) 
        for(const relProp of include.includes) query.include(<any> relProp);
      return <null> query.first(state);
    }
}
  