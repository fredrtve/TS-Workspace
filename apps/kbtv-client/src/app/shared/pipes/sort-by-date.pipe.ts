import { Pipe, PipeTransform } from '@angular/core';
import { _sortByDate } from '@fretve/array-helpers';
import { Immutable, ImmutableArray, Maybe, Prop } from '@fretve/global-types';

@Pipe({name: 'sortByDate'})
export class SortByDatePipe implements PipeTransform {
  transform<T>(
    entities: ImmutableArray<T>, 
    dateProperty: Prop<Immutable<T>>, 
    order: "asc" | "desc" = "desc"): Maybe<Immutable<T>[]>  {
    return entities ? _sortByDate<T>(entities, dateProperty, order) : null
  }
}
