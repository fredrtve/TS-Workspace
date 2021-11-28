import { Immutable, ImmutableArray } from '@fretve/global-types';
import { Reducer, StateAction } from '../interfaces';

export function _mergeReducers(reducers: ImmutableArray<Reducer<{}, StateAction>>, type: string): Reducer<{}, StateAction> {
    return <Reducer<{}, StateAction>>{type,
        reducerFn: (state: Immutable<{}>, action: Immutable<StateAction>): unknown => {
            let fullState: {} = {...state};
            let newState: {} = {}; 
            for(const reducer of reducers) {
                const reducerState = reducer.reducerFn(fullState, action);
                if(!reducerState) continue;
                fullState = {...fullState, ...reducerState} //merge total state for next reducer
                newState = {...newState, ...reducerState} //Store all new state to prevent emitting entire state
            }
            return newState;
        },
    }
}     