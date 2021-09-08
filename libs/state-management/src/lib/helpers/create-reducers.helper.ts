import { ActionCreator, InferCreatorAction, InferCreatorPayload, Reducer, ReducerFn, StateAction } from '../interfaces'

/** Helper function that creates an array of reducers
 *  @param {...*} reducer - A reducer {@link Reducer}
 *  @returns A reducer with the specified parameters. */
 export const _createReducers = <TState>(...reducers: Reducer<TState, StateAction>[]): Reducer<TState, StateAction>[] => { 
    return reducers
}

/** Helper function that creates a reducer
 *  @param type - The action type that triggers the reducer
 *  @param reducerFn - The reducerFn that should be executed
 *  @returns A reducer with the specified parameters. */
export const _on = <TState, TActionCreator extends ActionCreator<any,any>>(
    action: TActionCreator, 
    reducerFn: ReducerFn<TState, InferCreatorPayload<TActionCreator>>): Reducer<TState, InferCreatorAction<TActionCreator>> => { 
    return {type: action({}).type, reducerFn} 
}
