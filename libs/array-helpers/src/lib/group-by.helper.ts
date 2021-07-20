import { ImmutableArray, Immutable, Maybe, Prop } from 'global-types';
import { _weakMemoizer } from 'global-utils';

/**
 * Group an array of objects by a specified key
 * @param array - An array of objects
 * @param key - A key on the object to group by
 * @returns An object with keys accociated with an array of objects matching the key value
 */
export const _groupBy = _weakMemoizer(groupBy);

function groupBy<T>(
  array: Maybe<ImmutableArray<T>>, 
  key: Prop<Immutable<T>>
): {[key: string] : Immutable<T>[]}{
    if(!array?.length) return {};
    const result: {[key: string] : Immutable<T>[]} = {}; 
    for(var i = 0; i < array.length; i++){
      const entity = array[i];
      (result[<string> entity[key]] = result[<string> entity[key]] || []).push(entity);
    }
    return result
}