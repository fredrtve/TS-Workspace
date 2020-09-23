import { Observable } from 'rxjs';
import { ModelStateConfig } from '../../model/model-state.config';
import { StateProp } from '../../model/state.types';
import { Model } from '../../models';
import { ApiService } from '../../services/api.service';
import { ArrayHelperService } from '../../services/utility/array-helper.service';
import { BaseExtendedStore } from './base.extended.store';

export abstract class BaseModelStore<TState> extends BaseExtendedStore<TState>  {

    constructor(
        arrayHelperService: ArrayHelperService,
        apiService: ApiService) {  
        super(arrayHelperService, apiService);
    }

    modelProperty$ =   <T extends Model[]>(property: StateProp<TState>): Observable<T> => { 
        const modelCfg = ModelStateConfig.get(property);
        if(modelCfg.notPersisted) return this.property$(property, this.apiService.get(modelCfg.apiUrl));
        return this.property$(property);
    }
}
