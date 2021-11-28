import { ImmutableArray, Maybe } from '@fretve/global-types';

export interface AgGridConfig<TRecord>{
    data: Maybe<ImmutableArray<TRecord>>;
}