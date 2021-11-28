
import { Model } from '@core/models/base-entity.interface';
import { ModelState } from '@core/state/model-state.interface';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { Immutable, Prop } from '@fretve/global-types'

export interface DataConfig extends AgGridConfig<Model>{
    foreigns: Immutable<Partial<ModelState>>;
    selectedProp: Prop<ModelState>;
}