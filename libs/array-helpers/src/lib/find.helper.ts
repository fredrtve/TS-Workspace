import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';
import { _weakMemoizer } from '@fretve/global-utils';

/**
 * Find an object in an array of objects
 * @param array - An array of objects
 * @param value - A unique value used to find the object
 * @param idProp - A property on the object that contains a unique value
 */
export const _find = _weakMemoizer(find);

function find<T>(
  array: Maybe<ImmutableArray<T>>, 
  value: unknown, 
  idProp: Prop<Immutable<T>>): Maybe<Immutable<T>> {
    if(!array?.length || !value) return;

    for(let i = 0; i < array.length; i++){
      const obj = array[i];
      if(obj[idProp] === value) return obj;   
    }
    return;
}