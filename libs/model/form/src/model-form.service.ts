import { Injectable } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { FormService, FormSheetViewConfig, FormSheetWrapperComponent } from 'form-sheet';
import { Immutable, Maybe, NotNull } from "@fretve/global-types";
import { ModelContext, ModelQuery, StateModels, _getModelConfig } from "model/core";
import { combineLatest, isObservable, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { DeepPartial } from "ts-essentials";
import { _formToSaveModelConverter } from "./form-to-save-model-converter.helper";
import { ModelFormConfig, ModelFormServiceOptions } from "./interfaces";
import { ModelFormStore } from "./model-form.store";

/** Responsible for showing a form sheet with the specified model form */
@Injectable({providedIn: "any"})
export class ModelFormService<TState extends object> {

  constructor(
    private formService: FormService,
    private formStore: ModelFormStore<TState, StateModels<TState>>
  ) {}

  /** Opens the specified model form as a form sheet
   * @param config -
   * @param entityId - If set, the form will be in edit mode for the model with corresponding id.
   * @returns A reference to the bottom sheet with the model form.
   */
  open<
    TModel extends StateModels<TState>, 
    TForm extends object = TModel extends object ? TModel : never, 
    TInputState extends object = {}
  >(
    config: Immutable<ModelFormConfig<TState, TModel, TForm, TInputState>>,
    initialValue?: Immutable<Maybe<DeepPartial<TModel>>>,
    options?: ModelFormServiceOptions<TInputState, TForm>,
  ): MatBottomSheetRef<FormSheetWrapperComponent, Immutable<NotNull<TForm>> | 'deleted'> {

    const { idProp } = _getModelConfig<TState, TModel>(config.stateProp);
    const entityId = (<any> initialValue)?.[idProp];
    let findQuery = new ModelContext<TState>().get(<any> config.stateProp).where(x => (<any> x)[idProp] === entityId);
    let query = <ModelQuery<TState, TModel, any, any>> (config.includes ? config.includes(<any> findQuery) : findQuery);

    this.formStore.loadModels(query.getSelectedStateProps());
    const { formValue, modelValue } = this.getInitialValue(initialValue, config, entityId ? query : undefined);
    return this.formService.open<TForm, TState & TInputState, 'deleted'>(   
      this.getFormSheetViewConfig(config, entityId, options || {}),
      { 
        formState: this.getInputState$(options?.inputState), 
        initialValue: formValue
      },
      (form) => {
        if(options?.submitCallback) options.submitCallback(form);
        this.onSubmit(form, <any> config, modelValue)
      }
    );
  }

  private getFormSheetViewConfig<
    TModel extends StateModels<TState>, 
    TForm extends object = TModel extends object ? TModel : never, 
    TInputState extends object = {}
  >(
    config: Immutable<ModelFormConfig<TState, TModel, TForm, TInputState>>,
    entityId: Maybe<string>,
    options: ModelFormServiceOptions<TInputState, TForm>,
  ): Immutable<FormSheetViewConfig<TForm, TState & TInputState>> {

    return {
      formConfig: <any> config.dynamicForm,
      fullScreen: options.fullScreen,  
      useRouting: options.useRouting,    
      actionConfig: {
        submitText: `${entityId ? "Oppdater" : "Legg til"}`,
        ...config.actionOptions,
      },
      navConfig: {
        title: options?.customTitle || 
          `${entityId ? "Oppdater" : "Registrer"} 
          ${this.formStore.translateStateProp(<any> config.stateProp)}`,   
        buttons: (options?.deleteDisabled || !(entityId)) ? 
            undefined : 
            [{ icon: 'delete_forever', color: "warn", 
               callback: (ref) => this.formStore.confirmDelete(<any> config, entityId, ref) 
            }]    
      },
    }
  }

  private getInputState$(
    inputState: Maybe<Immutable<any> | Observable<Immutable<any>>>, 
  ){
    if(!inputState) return this.formStore.getState$();
    return combineLatest([
      isObservable(inputState) ? inputState : of(inputState),
      this.formStore.getState$()
    ]).pipe(
      map(([inputState, modelState]) => { return {...modelState, ...inputState} }), 
    );
  }

  private getInitialValue<TModel extends StateModels<TState>>(
    initialValue: Maybe<Immutable<any>>,
    config: Immutable<ModelFormConfig<TState, TModel, any, any>>,
    modelQuery?: ModelQuery<TState, TModel, any, any>,
  ): { formValue: any, modelValue: any } {
    let modelValue: Maybe<Immutable<any>> = initialValue;

    if(modelQuery){
      const model = this.formStore.getModel(modelQuery);
      if(model) modelValue = {...initialValue, ...(<any> model)};
    } 

    return {
      formValue: config.modelConverter! ? config.modelConverter(<any> modelValue || {}) : modelValue,
      modelValue
    }
  }

  private onSubmit(form: any, config: Immutable<ModelFormConfig<TState, StateModels<TState>, any, any>>, initialValueMerged: any){
    const converter = config.actionConverter || _formToSaveModelConverter
    this.formStore.save(converter({
      formValue: form, 
      options: this.formStore.getState(),
      stateProp: config.stateProp,
      initialValue: initialValueMerged
    }))
  }

}
