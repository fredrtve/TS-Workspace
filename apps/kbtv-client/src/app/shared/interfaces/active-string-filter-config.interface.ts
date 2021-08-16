import { Immutable, Maybe } from 'global-types';

export interface ActiveStringFilterConfig<TRecord, TCriteria>{
    criteriaFormatter?: (t: Maybe<TCriteria>) => Maybe<TCriteria>;
    filter: (x: Immutable<TRecord>, y: TCriteria) => boolean;
    nullFilter?: (x: Immutable<TRecord>) => boolean;
    maxChecks?: number;
    customDebounceTime?: number;
}