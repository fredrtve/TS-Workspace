import { ModelState } from '@core/state/model-state.interface';
import { Prop } from '@fretve/global-types';

export interface ComponentState {
    selectedProperty: Prop<ModelState>
}