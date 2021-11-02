import { Inject, Injectable } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ConfirmDialogService } from 'confirm-dialog';
import { Immutable, KeyVal } from 'global-types';
import { ModelContext, ModelQuery, RelationInclude, StateModels, StatePropByModel, _getModelConfig, _getRelationIncludeStateProps } from 'model/core';
import { ModelStatePropTranslations, MODEL_PROP_TRANSLATIONS, MODEL_STATE_PROP_TRANSLATIONS } from "model/shared";
import { ModelCommands } from 'model/state-commands';
import { ModelFetcherActions } from 'model/state-fetcher';
import { StateAction, Store } from 'state-management';
import { ModelFormConfig } from './interfaces';

@Injectable({providedIn: "any"})
export class ModelFormStore<TState extends object, TModel extends StateModels<TState>> {

  constructor(
    private store: Store<TState>,   
    private confirmService: ConfirmDialogService,  
    @Inject(MODEL_PROP_TRANSLATIONS) private translations: KeyVal<string>,
    @Inject(MODEL_STATE_PROP_TRANSLATIONS) private statePropTranslations: ModelStatePropTranslations
  ) {}

  getState(){ return this.store.state }

  getState$(){ return this.store.state$ }

  loadModels(props: string[]): void{
    this.store.dispatch(ModelFetcherActions.fetch<any>({ props }))
  }

  getModel(query: ModelQuery<TState, TModel, any, any>): Immutable<TModel>{
    return <Immutable<TModel>> query.first(this.store.state);
  }

  save(action: StateAction): void { this.store.dispatch(action); }

  translateStateProp = (prop: Immutable<StatePropByModel<TState, TModel>>): string => 
    this.statePropTranslations[<string> (<string> prop).toLowerCase()]?.singular.toLowerCase();

  confirmDelete = (
    formConfig: Immutable<ModelFormConfig<TState, TModel, any>>, 
    entityId: unknown,
    ref: MatBottomSheetRef<unknown, unknown>) => { 
    const translatedProp = this.translateStateProp(formConfig.stateProp);
    const modelCfg = _getModelConfig(formConfig.stateProp);
    const idWord = this.translations[(<string> modelCfg.idProp).toLowerCase()] || modelCfg.idProp
    this.confirmService.open({
        title: `Slett ${translatedProp}?`, 
        message: `Bekreft at du ønsker å slette ${translatedProp} med ${idWord.toLowerCase()} "${entityId}"`, 
        confirmText: 'Slett',
        confirmCallback: () => this.deleteEntity(formConfig, entityId, ref)
    });
  }

  private deleteEntity = (
    formConfig: Immutable<ModelFormConfig<TState, TModel, any>>, 
    entityId: unknown,
    ref: MatBottomSheetRef<unknown, unknown>) => {
      ref.dismiss('deleted');
      this.store.dispatch(ModelCommands.delete<any, any>({ 
        stateProp: <any> formConfig.stateProp, 
        payload: { id: <string> entityId } 
      }));
  };
}