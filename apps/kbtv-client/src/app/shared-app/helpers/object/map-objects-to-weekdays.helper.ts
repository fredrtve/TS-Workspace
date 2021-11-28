import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';

export function _mapObjectsToWeekdays<T>(
  objects: Maybe<ImmutableArray<T>>, 
  dateProp: Prop<Immutable<T>>
): Maybe<{ [key: number]: Immutable<T>  }> {
  if(!objects) return undefined;
  const result: { [key: number]: Immutable<T> } = {};
  for(let i = 0; i < objects.length; i++){
    const obj = objects[i];
    result[new Date(<Date> obj[dateProp]).getDay() || 7] = obj;
  }
  return result;
}