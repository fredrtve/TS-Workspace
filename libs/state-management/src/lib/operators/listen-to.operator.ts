import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionCreator, DispatchedAction } from '../interfaces';

/** An rxjs operator used to filter the types of actions provided from an action observer.
 * @param types - The types of actions that should emit
 */
export const listenTo = <TState, TActionCreator extends ActionCreator<any, string>>(actions: TActionCreator[]) => {
    const typeLookup: Record<string, string>  = {};
    
    for(const action of actions){
        const type = action({}).type;
        typeLookup[type] = type;
    }

    return (
        source: Observable<DispatchedAction<TActionCreator, TState>> 
    ): Observable<DispatchedAction<TActionCreator, TState>> => 
        source.pipe(
            filter(dispatched => typeLookup[dispatched.action.type] !== undefined),  
        )
}