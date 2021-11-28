import { ImmutableArray } from "@fretve/global-types";

export function _flattenProviders<T>(providers: ImmutableArray<T[]>): ImmutableArray<T> {
    let result: ImmutableArray<T> = [];
    for(const providerArr of providers) result = result.concat(providerArr);
    return result; 
}