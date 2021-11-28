import { Immutable, ImmutableArray, Maybe, Prop} from '@fretve/global-types';
import { _weakMemoizer } from '@fretve/global-utils';

type Response<T> = { [key: string]: Immutable<T> }

/**
 * Convert an array to a key/value object
 * @param array - 
 * @param key - An item property or function used as key in the object. If null, the value is used as key.
 * @returns An object containing keys with accociated values
 */
export const _convertArrayToObject = _weakMemoizer(convertArrayToObject)

function convertArrayToObject<T>(
  array: Maybe<ImmutableArray<T>>, 
  key?: Prop<Immutable<T>> | ((t: Immutable<T>) => string | number) | null
): Response<T> {
    if(!array?.length) return {};

    const result: Response<T> = {}; 
    
    let setter: (entity: Immutable<T>, result: Response<T>) => void;

    switch(typeof key){
      case "string": 
        setter = (entity, result) => result[<string> entity[key]] = entity; 
        break;
      case "function":
        setter = (entity, result) => result[(<(t: Immutable<T>) => string> key)(entity)] = entity
        break;
      default:
        setter = (entity, result) => result[entity as unknown as string] = entity
        break;
    }

    for(var i = 0; i < array.length; i++) setter(array[i], result);

    return result;
}

