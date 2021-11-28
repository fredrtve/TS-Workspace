import { Inject, Injectable, Optional } from '@angular/core';
import { Immutable, Maybe, UnknownState } from '@fretve/global-types';
import { filter } from 'rxjs/operators';
import { StateChanges, Store } from 'state-management';
import { STATE_DB_ACTION_FILTER, STATE_DB_CONFIG } from './injection-tokens.const';
import { DbActionFilter, StateDbConfig } from './interfaces';
import { StateDbService } from './state-db.service';
import { DbActions } from './state/actions.const';

@Injectable({providedIn: 'root'})
export class StatePersisterService {
 
    constructor(
        private store: Store<UnknownState>,  
        private stateDbService: StateDbService, 
        @Inject(STATE_DB_CONFIG) private dbConfig: StateDbConfig<UnknownState>,
        @Optional() @Inject(STATE_DB_ACTION_FILTER) private actionFilter: Maybe<DbActionFilter>,
    ) { 
        this.store.stateChanges$.pipe(filter(this.filterChanges)).subscribe(this.persistChanges);
    }

    private persistChanges = ({state}: Immutable<StateChanges<UnknownState>>): void => { 
        if(!state) return;
        for(const prop in state) this.persistPropChanges(prop, state[prop])  
    }

    private persistPropChanges = (prop: string, payload: unknown): void => {     
        const propCfg = this.dbConfig[prop];
        
        if(!propCfg) return;

        if(propCfg.onPersistMapping) payload = propCfg.onPersistMapping(payload);
         
        if(propCfg.storageType === "idb-keyval") 
            this.stateDbService.set(prop, payload)
        else
             window.localStorage.setItem(prop, JSON.stringify(payload))
    }

    private filterChanges = ({action}: Immutable<StateChanges<UnknownState>>): boolean => {
        let exp = action.type !== DbActions.setPersistedState(<any> {}).type;
        if(this.actionFilter) exp = exp && this.actionFilter(action);
        return exp
    }

}



