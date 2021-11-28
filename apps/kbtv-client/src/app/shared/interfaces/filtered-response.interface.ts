import { Maybe } from "@fretve/global-types";

export interface FilteredResponse<TCriteria, TRecord>{
    criteria: Maybe<TCriteria>,
    records: Maybe<TRecord[]>
}