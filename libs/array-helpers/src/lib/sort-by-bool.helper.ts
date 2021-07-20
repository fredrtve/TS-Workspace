import { Immutable, ImmutableArray, Maybe, UnknownState, Prop } from 'global-types'; 
import { _weakMemoizer } from 'global-utils';

/**
 * Sort an array of objects by a boolean property.
 * @param collection - An array of objects
 * @param prop - The boolean property to sort by
 * @param trueFirst - Set to true if false values should come last
 */
export const _sortByBool = _weakMemoizer(sortByBool);

function sortByBool<T extends {}>(
    collection: Maybe<ImmutableArray<T>>, 
    prop: Prop<Immutable<T>>, 
    trueFirst?: boolean): Immutable<T>[]{
    if(!collection?.length) return [];
    return collection.slice().sort((x: UnknownState, y: UnknownState) => {
        if(trueFirst) return (x[prop] === y[prop])? 0 : x[prop]? -1 : 1;
        return (x[prop] === y[prop])? 0 : x[prop]? 1 : -1;
    });
}