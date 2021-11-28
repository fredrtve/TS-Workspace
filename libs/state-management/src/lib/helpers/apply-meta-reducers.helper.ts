import { Reducer, MetaReducer, StateAction } from '../interfaces';
import { ImmutableArray } from '@fretve/global-types';

export function _applyMetaReducers(
    reducer: Reducer<{}, StateAction>, 
    metaReducers: ImmutableArray<MetaReducer<{}, StateAction>>): Reducer<{}, StateAction> {
    if(!metaReducers?.length) return reducer;
    let clone = {...reducer};
    for(const metaReducer of metaReducers) clone = metaReducer(clone)
    return clone;
}