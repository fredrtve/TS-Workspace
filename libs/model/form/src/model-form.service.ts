import { Injectable } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { FormService, FormSheetViewConfig, FormSheetWrapperComponent } from 'form-sheet';
import { Immutable, Maybe } from "global-types";
import { StateModels, _getModelConfig } from "model/core";
import { ModelCommand, SaveAction } from "model/state-commands";
import { DeepPartial } from "ts-essentials";
import { ModelFormConfig, ModelFormServiceOptions } from "./interfaces";
import { ModelFormComponent } from './model-form.component';
import { ModelFormFacade } from "./model-form.facade";

type BottomSheetRef = MatBottomSheetRef<FormSheetWrapperComponent, ModelCommand>;

/** Responsible for showing a form sheet with the specified model form */
@Injectable({providedIn: "any"})
export class ModelFormService<TState extends object> {

  constructor(
    private formService: FormService,
    private facade: ModelFormFacade<TState, StateModels<TState>>
  ) {}

  /** Opens the specified model form as a form sheet
   * @param config -
   * @param entityId - If set, the form will be in edit mode for the model with corresponding id.
   * @returns A reference to the bottom sheet with the model form.
   */
  open<
    TModel extends StateModels<TState>, 
    TForm extends object = TModel extends object ? TModel : never, 
    TInputState extends object | null = null
  >(
    config: Immutable<ModelFormConfig<TState, TModel, TForm, TInputState>>,
    initialValue?: Immutable<Maybe<DeepPartial<TForm>>>,
    options?: Immutable<ModelFormServiceOptions<TState>>,
  ): BottomSheetRef {

    var ref: MatBottomSheetRef<FormSheetWrapperComponent, SaveAction> = 
      this.formService.open(   
        <any>this.getFormSheetViewConfig<TModel, TForm, TInputState>(config, initialValue || {}, options || {}),
        { formState: options?.formState, initialValue },
        options?.submitCallback
      )

    return ref;
  }

  private getFormSheetViewConfig<
    TModel extends StateModels<TState>, 
    TForm extends object = TModel extends object ? TModel : never, 
    TInputState extends object | null = null
  >(
    config: Immutable<ModelFormConfig<TState, TModel, TForm, TInputState>>,
    initialValue: any,
    options: Immutable<ModelFormServiceOptions<TState>>,
  ): Immutable<FormSheetViewConfig<TForm, TInputState, ModelFormConfig<TState, TModel, TForm, TInputState>, SaveAction>> {
    const entityId = initialValue[_getModelConfig(config.includes.prop).idProp];
    return {
      formConfig: config,
      fullScreen: options.fullScreen,  
      useRouting: options.useRouting,    
      customFormComponent: ModelFormComponent,
      navConfig: {
        title: options?.customTitle || 
          `${entityId ? "Oppdater" : "Registrer"} 
          ${this.facade.translateStateProp(<any> config.includes.prop)}`,   
        buttons: (options?.deleteDisabled || !(entityId)) ? 
            undefined : 
            [{ icon: 'delete_forever', color: "warn", 
               callback: (ref: BottomSheetRef) => 
                this.facade.confirmDelete(<any> config, entityId, ref) 
            }]    
      },
    }
  }

}
