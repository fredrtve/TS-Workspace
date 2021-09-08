import { Inject, Injectable } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ConfirmDialogService } from 'confirm-dialog';
import { Immutable, KeyVal } from 'global-types';
import { RelationInclude, StateModels, StatePropByModel, _getModelConfig, _getRelationIncludeStateProps } from 'model/core';
import { ModelStatePropTranslations, MODEL_PROP_TRANSLATIONS, MODEL_STATE_PROP_TRANSLATIONS } from "model/shared";
import { ModelCommand, ModelCommands } from 'model/state-commands';
import { ModelFetcherActions } from 'model/state-fetcher';
import { Observable } from 'rxjs';
import { StateAction, Store } from 'state-management';
import { ModelFormConfig } from './interfaces';

@Injectable({providedIn: "any"})
export class ModelFormFacade<TState extends object, TModel extends StateModels<TState>> {

  constructor(
    private store: Store<TState>,   
    private confirmService: ConfirmDialogService,  
    @Inject(MODEL_PROP_TRANSLATIONS) private translations: KeyVal<string>,
    @Inject(MODEL_STATE_PROP_TRANSLATIONS) private statePropTranslations: ModelStatePropTranslations
  ) {}

  loadModels(
    includes: Immutable<RelationInclude<TState, TModel>>): void{
    this.store.dispatch(ModelFetcherActions.fetch<any>({
      props: _getRelationIncludeStateProps(includes)
    }))
  }

  getModelState$(includes: Immutable<RelationInclude<TState, TModel>>): Observable<Immutable<Partial<TState>>> {
    return this.store.select$<any>(_getRelationIncludeStateProps(includes)) as Observable<Immutable<Partial<TState>>>
  }

  save(action: StateAction): void {
    this.store.dispatch(action);
  }

  translateStateProp = (prop: Immutable<StatePropByModel<TState, TModel>>): string => 
    this.statePropTranslations[<string> (<string> prop).toLowerCase()]?.singular.toLowerCase();

  confirmDelete = (
    formConfig: Immutable<ModelFormConfig<TState, TModel, any>>, 
    entityId: unknown,
    ref: MatBottomSheetRef<unknown, unknown>) => { 
    const translatedProp = this.translateStateProp(formConfig.includes.prop);
    const modelCfg = _getModelConfig(formConfig.includes.prop);
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
      ref.dismiss(ModelCommand.Delete);
      this.store.dispatch(ModelCommands.delete<any, any>({ 
        stateProp: <any> formConfig.includes.prop, 
        payload: { id: <string> entityId } 
      }));
  };
}