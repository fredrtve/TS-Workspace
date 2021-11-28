import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';
import { _convertArrayToObject } from './convert-array-to-object.helper';

/**
 * Merge two arrays of objects, updating any objects that overlap
 * @param originals - The original array of objects that may be overriden
 * @param values - The new array of objects that should be added 
 * @param idProp - A property on the object that uniquely identifies it
 */
export function _addOrUpdateRange<T>(
    originals: Maybe<ImmutableArray<T>>, 
    values: Maybe<ImmutableArray<T>>, 
    idProp: Prop<Immutable<T>>): Immutable<T>[]{   

    if(!values?.length) return originals?.slice() || []; //If no entities, just return current val
    if(!originals?.length) return values.slice(); //If initial array empty, just return empty array

    let originalsObj = _convertArrayToObject(originals, idProp);
    const newEntities: Immutable<T>[] = [];
    for(let i = 0; i < values.length; i++){  
      let newObj = values[i];
      const itemKey = <string> (idProp ? newObj[idProp] : newObj); //Ungse idProp as key else obj
      let existingObj = originalsObj[itemKey]; //Grab existing obj
      if(existingObj) originalsObj[itemKey] = {...existingObj, ...newObj}; //If obj exist, update it with new obj
      else newEntities.push(newObj);    
    } 

    return [...newEntities, ...Object.values<Immutable<T>>(originalsObj)];
}