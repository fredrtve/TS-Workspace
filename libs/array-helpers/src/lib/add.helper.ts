import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';

/**
 * Add a value to the start of an array without mutating it. 
 * @param array -
 * @param value - 
 */
export function _add<T>(array: Maybe<ImmutableArray<T>>, value: Immutable<T>): Immutable<T>[]{
    if(!array?.length) return [value];
    let arr = array.slice();
    arr.unshift(value);
    return arr;
}