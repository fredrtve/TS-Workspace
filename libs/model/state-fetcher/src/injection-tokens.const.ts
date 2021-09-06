import { InjectionToken } from "@angular/core";
import { FetcherRetryStrategy } from "./interfaces";

/** Used to inject a base url appended to all fetch requests */
export const MODEL_FETCHER_BASE_URL = new InjectionToken<string>("ModelFetcherBaseUrl")

/** Used to inject a custom retry strategy for http calls */
export const MODEL_FETCHER_RETRY_STRATEGY = new InjectionToken<FetcherRetryStrategy>("ModelFetcherRetryStrategy")