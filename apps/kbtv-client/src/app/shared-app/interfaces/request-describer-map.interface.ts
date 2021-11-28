import { Immutable } from "@fretve/global-types";
import { OptimisticHttpRequest, SupportedContentTypes } from "optimistic-http";
import { FilterRequestByType } from "./filter-request-by-type.interface";

export type RequestDescriberMap<TRequests extends Omit<OptimisticHttpRequest<SupportedContentTypes>, "type"> & {type: string}, TState> = { 
    [P in TRequests['type']]: (request: Immutable<FilterRequestByType<TRequests, P>>, state: Immutable<TState>) => string
} 