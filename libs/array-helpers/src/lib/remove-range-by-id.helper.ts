import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';

/**
 * Remove a range  of objects from an array of objects
 * @param originals - An array of objects
 * @param deletedIds - An array of unique values used to find the objects to delete
 * @param idProp - A property on the object that contains a unique value
 */
export function _removeRangeById<T>(
  originals: Maybe<ImmutableArray<T>>, 
  deletedIds: ImmutableArray<unknown>, 
  idProp: Prop<Immutable<T>>  ): Immutable<T>[] {       
    if(!deletedIds?.length) return originals?.slice() || []; //If no deleted ids, just return originals
    if(!originals?.length) return []; //If initial array empty, just return empty array

    const copy = originals.slice();

    let delCount = deletedIds.length;
    
    for(let i = 0; i < originals.length; i++){  	
      let entity = originals[i]; 
           
      if(deletedIds.indexOf(entity[idProp]) !== -1){
        copy.splice(i + delCount - deletedIds.length, 1);
        delCount = delCount - 1;
      }
      
      if(delCount === 0) break;
    }

    return copy;
}