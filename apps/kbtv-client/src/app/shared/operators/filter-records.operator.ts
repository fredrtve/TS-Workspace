import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { _filter } from '@fretve/array-helpers';
import { DataFilterConstructor } from '@shared/data.filter';
import { FilteredResponse } from '@shared/interfaces';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';

type Response<TRecord, TCriteria> = FilteredResponse<Immutable<TCriteria>, Immutable<TRecord>>;

export const filterRecords = <TRecord, TCriteria>(filterType: DataFilterConstructor<TCriteria>, ...filterArgs: unknown[]) => 
    (source: Observable<[Maybe<ImmutableArray<TRecord>>, Maybe<Immutable<Partial<TCriteria>>>]> ): Observable<Response<TRecord, TCriteria>> => 
        source.pipe(
            map(([timesheets, criteria]) => {
                if(!criteria) return {criteria: null, records: null};
                const filter = new filterType(criteria, ...filterArgs);
                return <Response<TRecord, TCriteria>>{
                    criteria,
                    records: _filter(timesheets, (entity) => filter.check(entity)),
                };
            }), 
        )