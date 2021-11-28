import { DataFilterConstructor } from "@shared/data.filter";
import { Immutable, ImmutableArray, Maybe } from "@fretve/global-types";

export function _isCriteriaContainedInCache<TCriteria>(
    criteria: Maybe<Immutable<TCriteria>>, 
    criteriaCache: Maybe<ImmutableArray<TCriteria>>,
    filterType: DataFilterConstructor<TCriteria>, 
    ...filterArgs: unknown[]
): boolean {
    if(!criteria) return true;
    if(!criteriaCache?.length) return false;
    const filter = new filterType(criteria, filterArgs);

    for(const cachedCriteria of criteriaCache)
      if(filter.containedIn(cachedCriteria)) return true;

    return false;
} 
