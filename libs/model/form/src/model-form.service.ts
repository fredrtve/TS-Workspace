import { Injectable } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { FormService, FormSheetViewConfig, FormSheetWrapperComponent } from 'form-sheet';
import { Immutable, Maybe, NotNull } from "global-types";
import { StateModels, _getModelConfig } from "model/core";
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

    this.formStore.loadModels(<any> config.includes);

    const entityId = (<any> initialValue)?.[_getModelConfig(config.includes.prop).idProp];

    return this.formService.open<TForm, TState & TInputState, 'deleted'>(   
      this.getFormSheetViewConfig(config, entityId, options || {}),
      { 
        formState: this.getInputState$(options?.inputState, <any> config), 
        initialValue: this.getInitialValue(initialValue, entityId, <any> config)
      },
      (form) => {
        if(options?.submitCallback) options.submitCallback(form);
        this.onSubmit(form, <any> config)
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
          ${this.formStore.translateStateProp(<any> config.includes.prop)}`,   
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
    config: Immutable<ModelFormConfig<TState, StateModels<TState>, any, any>>,
  ){
    if(!inputState) return this.formStore.getModelState$(config.includes);
    return combineLatest([
      isObservable(inputState) ? inputState : of(inputState),
      this.formStore.getModelState$(config.includes)
    ]).pipe(
      map(([inputState, modelState]) => { return {...inputState, ...modelState} }), 
    );
  }

  private getInitialValue(
    initialValue: Maybe<Immutable<any>>,
    entityId: Maybe<string>,
    config: Immutable<ModelFormConfig<TState, StateModels<TState>, any, any>>,
  ){
    let modelValue: Maybe<Immutable<any>> = initialValue;

    if(entityId){
      const model = this.formStore.getModel(entityId, config.includes);
      if(model) modelValue = {...initialValue, ...(<any> model)};
    } 

    return config.modelConverter! ? config.modelConverter(<any> modelValue || {}) : modelValue
  }

  private onSubmit(form: any, config: Immutable<ModelFormConfig<TState, StateModels<TState>, any, any>>){
    const converter = config.actionConverter || _formToSaveModelConverter
    this.formStore.save(converter({
      formValue: form, 
      options: this.formStore.getState(),
      stateProp: config.includes.prop
    }))
  }

}
