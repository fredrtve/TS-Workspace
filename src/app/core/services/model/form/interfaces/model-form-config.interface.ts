import { Model } from 'src/app/core/models';
import { Prop } from 'src/app/shared-app/prop.type';
import { ModelState } from '../../interfaces/model-state.interface';
import { ModelFormViewConfig } from './model-form-view-config.interface';

export interface ModelFormConfig<TFormState, TModel extends Model, TViewConfig extends ModelFormViewConfig<TModel, TFormState>> {      
    entityId?: any;
    stateProp: Prop<ModelState>;
    viewConfig?: TViewConfig
}