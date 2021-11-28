
import { Model } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { Prop } from '@fretve/global-types';
import { _getModelConfig } from 'model/core';

export function _trackByModel(prop: Prop<ModelState>){
    const idProp = _getModelConfig<ModelState, Model>(<any> prop).idProp;
    return (index:number, model:Model): unknown => model[idProp];
}