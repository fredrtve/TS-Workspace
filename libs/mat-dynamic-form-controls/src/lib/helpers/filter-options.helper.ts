import { _filter } from "@fretve/array-helpers";
import { Immutable, Maybe } from "@fretve/global-types";
import { _weakMemoizer } from "@fretve/global-utils";
import { FilterConfig } from "./filter.config";

function filterRecord<TRecord, TCriteria>(
    record: Immutable<TRecord>, 
    criteria: Maybe<Partial<TCriteria>>, 
    filter: (t: Immutable<TRecord>, c: Maybe<Partial<TCriteria>>) => boolean,
    checkCount: number, 
    maxChecks?: number
): boolean {
    if(!record) return false;
    if(maxChecks && checkCount >= maxChecks) return false; 
    let valid = filter(record, criteria);
    if(valid && maxChecks) checkCount++;
    return valid;
}

function filterOptions<TRecord, TCriteria extends string>(
    options: Maybe<Immutable<TRecord[]>>,
    config: FilterConfig<TRecord, TCriteria>,
    criteria: Maybe<Partial<TCriteria>>, 
): Immutable<TRecord[]> {
    if(config.criteriaFormatter) 
        criteria = config.criteriaFormatter(criteria);
                 
    const filter = (criteria && criteria.length !== 0) ? config.filter : config.nullFilter;
    
    if(!filter) 
        return (config.maxChecks ? options?.slice(0, config.maxChecks) : options) || []; 
    else {
        let checkCount = 0;
        return _filter<TRecord>(options, (t) => filterRecord(t, criteria, filter, checkCount, config.maxChecks));    
    }   
}

export const _filterOptions = _weakMemoizer(filterOptions);