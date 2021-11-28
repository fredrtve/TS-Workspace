import { Immutable, Maybe } from "@fretve/global-types";

export interface FilterConfig<TRecord, TCriteria>{
    criteriaFormatter?: (t: Maybe<Partial<TCriteria>>) => Maybe<Partial<TCriteria>>;
    filter: (x: Immutable<TRecord>, y: Partial<TCriteria>) => boolean;
    nullFilter?: (x: Immutable<TRecord>) => boolean;
    maxChecks?: number;
}