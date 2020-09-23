import { ObservableStore } from '@codewithdan/observable-store';
import { stateFunc } from '@codewithdan/observable-store/dist/observable-store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
import { Prop } from '../../model/state.types';
import { ApiService } from '../../services/api.service';
import { ArrayHelperService } from '../../services/utility/array-helper.service';

export abstract class BaseStore<TState> extends ObservableStore<TState>  {

    constructor(
        protected arrayHelperService: ArrayHelperService,
        protected apiService: ApiService) {  
        super({logStateChanges: true, trackStateHistory: false});
    }
    
    property$<T>(property: Prop<TState>): Observable<T>{ 
        return  this.globalStateWithPropertyChanges.pipe(
            map(({state}) => state ? state[property as string] : null),
            distinctUntilChanged()
        )
    }

    propertyChanges$<T>(property: Prop<TState>): Observable<T>{ 
        return  this.globalStateWithPropertyChanges.pipe(
            skip(1), //Skip initial value
            filter(({stateChanges}) => stateChanges.hasOwnProperty(property)), 
            map(({state}) => state ? state[property as string] : null),
            distinctUntilChanged()
        )
    }

    protected _setStateVoid(state: Partial<TState> | stateFunc<TState>, action?: string): void{ 
        if(typeof state === "function") this._setState(state(this.getState()), action, true, false)
        else this._setState(state as Partial<TState>, action, true, false) 
    }

    protected _setState(state: Partial<TState> , action?: string, dispatchState?: boolean, deepCloneState?: boolean): TState{
        state['lastAction'] = action;
        return super.setState(state, action, dispatchState, deepCloneState);
    } 
}
