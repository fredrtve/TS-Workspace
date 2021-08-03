import { Immutable, ImmutableArray, Maybe, Prop } from 'global-types';
import { _convertArrayToObject } from './convert-array-to-object.helper';

/**
 * Remove a range  of objects from an array of objects based on a common property value
 * @param originals - An array of objects
 * @param value - The value or array of values to compare against the object property
 * @param idProp - A property on the object that contains the value
 */
export function _removeRangeByProp<T>(
  originals: Maybe<ImmutableArray<T>>, 
  value: unknown | unknown[], 
  prop: Prop<Immutable<T>>): Immutable<T>[] {    
    if(!originals?.length) return []; //If initial array empty, just return empty array
  
    const copy = originals.slice();   
    let delCount = 0;
    if(!Array.isArray(value))
        for(let i = 0; i < originals.length; i++) {
            const item = originals[i];	
            if(item && item[prop] === value){ 
                copy.splice(i - delCount, 1);
                delCount = delCount + 1;
            } 
        } 
    else {
        const lookup = _convertArrayToObject(value)
        for(let i = 0; i < originals.length; i++) 	{
            const item = originals[i];	
            if( item && lookup[<string> item[prop]] !== undefined){              
                copy.splice(i - delCount, 1);
                delCount = delCount + 1;
            }
        }
    } 
    return copy;
}