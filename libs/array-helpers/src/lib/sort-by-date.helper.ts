import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';
import { _weakMemoizer } from '@fretve/global-utils';

/**
 * Sort an array of objects by a date property
 * @param collection - An array of objects
 * @param prop - A date property on the object
 * @param direction - A sorting direction. Default is 'desc'
 */
export const _sortByDate = _weakMemoizer(sortByDate);

function sortByDate<T extends {}>(
    collection: Maybe<ImmutableArray<T>>, 
    prop: Prop<Immutable<T>>, 
    direction: "asc" | "desc" = "desc"): Maybe<Immutable<T>[]> {
    if(!collection) return null;
    return collection.slice().sort((a: Immutable<T>, b: Immutable<T>) => {
        if(!a[prop]) return 1;
        if(!b[prop]) return -1;

        let aVal: Date = new Date(a[prop] as unknown as Date);
        let bVal: Date = new Date(b[prop] as unknown as Date);

        if(direction === "asc") return aVal.getTime() - bVal.getTime();
        else return bVal.getTime() - aVal.getTime();
    });
}