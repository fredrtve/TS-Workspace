import { Maybe, ImmutableArray, Immutable, Prop } from "global-types";

/**
 * Add or update a object in given array
 * @param array - The array to add or update object 
 * @param updatedObj - The new or updated object
 * @param idProp - A unique identifier for the object
 * @returns 
 */
export function _addOrUpdate<T extends {}>(
    array: Maybe<ImmutableArray<T>>, 
    updatedObj: Partial<Immutable<T>>, 
    idProp: Prop<Immutable<T>>): Immutable<T>[] {
      if(!array?.length) return [<Immutable<T>> updatedObj];
      const arr = array.slice();
      let updated = false;
      for(let i = 0; i < arr.length; i++){
        const obj = arr[i];
        if(obj[idProp] === updatedObj[idProp]){
          arr[i] = {...obj, ...updatedObj};
          updated = true;
          break;
        }
      }
      if(updated === false) arr.unshift(<any> updatedObj);
      return <Immutable<T>[]> arr;
}