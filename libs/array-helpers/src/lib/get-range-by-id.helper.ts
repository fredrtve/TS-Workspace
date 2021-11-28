import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';
import { _convertArrayToObject } from './convert-array-to-object.helper';
import { _weakMemoizer } from '@fretve/global-utils';

/**
 * Get a range of objects
 * @param originals - An array of objects 
 * @param ids - An array of unique values that identify the objects
 * @param idProp - A property on the object that contains a unique value
 */
export const _getRangeById = _weakMemoizer(getRangeById)

function getRangeById<T>(
  originals: Maybe<ImmutableArray<T>>, 
  ids: ImmutableArray<unknown>, 
  idProp: Prop<Immutable<T>>): Immutable<T>[]{       
    if(!originals?.length) return []; //If initial array empty, just return empty array  
    if(!ids?.length) return []; //If no deleted ids, just return originals
    
    let originalsObj = _convertArrayToObject<T>(originals, idProp);
    let result: Immutable<T>[] = [];

    for(let i = 0; i < ids.length; i++){  
      let match = originalsObj[ids[i] as string];
      if(match) result.push(match)
    } 

    return result;
}