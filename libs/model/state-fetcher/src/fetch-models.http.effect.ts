import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Optional } from '@angular/core'
import { Immutable, UnknownState } from '@fretve/global-types'
import { UnknownModelState, _getModelConfig } from 'model/core'
import { merge, Observable, of } from 'rxjs'
import { catchError, finalize, map, mergeMap, retryWhen } from 'rxjs/operators'
import { DispatchedActions, Effect, listenTo, StateAction } from 'state-management'
import { MODEL_FETCHER_BASE_URL, MODEL_FETCHER_RETRY_STRATEGY } from './injection-tokens.const'
import { FetcherRetryStrategy, FetchingStatusMap, ModelFetcherConfig, StateFetchingStatus } from './interfaces'
import { ModelFetcherActions } from './state/actions'

@Injectable()
export class FetchModelsHttpEffect implements Effect {

    private static pendingProperties: { [key: string]: boolean } = {}

    constructor(
        private httpClient: HttpClient,
        @Optional() @Inject(MODEL_FETCHER_RETRY_STRATEGY) private retryStrategy?: FetcherRetryStrategy,
        @Optional() @Inject(MODEL_FETCHER_BASE_URL) private baseUrl?: string,
    ){ }

    handle$(actions$: DispatchedActions<StateFetchingStatus<UnknownModelState>>) {
        return actions$.pipe(
            listenTo([ModelFetcherActions.fetch]),
            mergeMap(({action, stateSnapshot}) => {
                const fetchers : Observable<StateAction>[]= []; 

                const fetchingStatus: FetchingStatusMap<any> = {};

                for(const prop of (<Immutable<{props: string[]}>><unknown> action).props){
                    if((<UnknownState> stateSnapshot)[prop] || (stateSnapshot.fetchingStatus && stateSnapshot.fetchingStatus[prop] === "fetching")) continue;

                    const modelCfg = _getModelConfig<any,any, ModelFetcherConfig>(prop);
                    if(!this.isFetchable(modelCfg)) continue;

                    fetchingStatus[prop] = "fetching";

                    let fetcher = this.fetch$(modelCfg, prop);

                    if(this.retryStrategy) 
                        fetcher = fetcher.pipe(retryWhen(this.retryStrategy));

                    fetchers.push(fetcher.pipe(
                        map(payload => ModelFetcherActions.fetchSucceeded({ payload, stateProp: prop })),
                        catchError(e => of(ModelFetcherActions.fetchFailed({ stateProp: prop })))
                    ));
                }
                if(fetchers.length) return merge(of(ModelFetcherActions.isFetching({fetchingStatus})), ...fetchers)
                return merge(...fetchers);
            })
        )
    }

    private fetch$(modelCfg: Immutable<ModelFetcherConfig>, prop: string): Observable<unknown[]>{
        return this.httpClient.get<unknown[]>((this.baseUrl || "") + modelCfg.fetchUrl).pipe(
            finalize(() => FetchModelsHttpEffect.pendingProperties[prop] = false)
        )
    }

    private isFetchable = (modelConfig: Immutable<ModelFetcherConfig>): boolean => 
      modelConfig != null && modelConfig.fetchUrl != null
}