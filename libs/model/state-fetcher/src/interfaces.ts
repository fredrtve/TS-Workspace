import { HttpErrorResponse } from "@angular/common/http";
import { Prop, UnknownState } from "global-types";
import { ModelConfig, StateModels } from "model/core";
import { Observable } from "rxjs";

/** Represents an extended model configuration for a given model for fetchable models */
export interface ModelFetcherConfig<
TState = UnknownState, 
TModel extends StateModels<TState> = StateModels<TState>> extends ModelConfig<TState, TModel>{
  /** Url endpoint that serves the model data when fetched. If not set, fetching will be disabled for given model.*/
  fetchUrl?: string;
}

/** Represents the different statuses for a model fetching */
export type FetchingStatus = "success" | "failed" | "fetching";

/** Represents a map of fetching statuses for props in TState */
export type FetchingStatusMap<TState> = Record<Prop<TState>, FetchingStatus>;

/** Represents a slice of state containing an map of fetching statuses for given models */
export interface StateFetchingStatus<TState> { fetchingStatus: FetchingStatusMap<TState> }

/** Represents an higher order observable for deciding a retry strategy for http calls. Used together with retryWhen operator. */
export type FetcherRetryStrategy = (obs: Observable<HttpErrorResponse>) => Observable<any>