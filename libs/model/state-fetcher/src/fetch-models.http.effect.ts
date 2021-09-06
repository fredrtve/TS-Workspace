import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Optional } from '@angular/core'
import { Immutable } from 'global-types'
import { UnknownModelState, _getModelConfig } from 'model/core'
import { merge, Observable, of } from 'rxjs'
import { catchError, finalize, map, mergeMap, retryWhen } from 'rxjs/operators'
import { DispatchedAction, Effect, listenTo, StateAction } from 'state-management'
import { MODEL_FETCHER_BASE_URL, MODEL_FETCHER_RETRY_STRATEGY } from './injection-tokens.const'
import { FetcherRetryStrategy, ModelFetcherConfig, StateFetchingStatus } from './interfaces'
import { IsFetchingModelsAction, ModelFetchingFailedAction, ModelFetchingSucceededAction, FetchModelsAction } from './state/actions'

@Injectable()
export class FetchModelsHttpEffect implements Effect<FetchModelsAction<{}>> {

    private static pendingProperties: { [key: string]: boolean } = {}

    constructor(
        private httpClient: HttpClient,
        @Optional() @Inject(MODEL_FETCHER_RETRY_STRATEGY) private retryStrategy?: FetcherRetryStrategy,
        @Optional() @Inject(MODEL_FETCHER_BASE_URL) private baseUrl?: string,
    ){ }

    handle$(actions$: Observable<DispatchedAction<FetchModelsAction<{}>, StateFetchingStatus<UnknownModelState>>>) {
        return actions$.pipe(
            listenTo([FetchModelsAction]),
            mergeMap(({action, stateSnapshot}) => {
                const fetchers: Observable<StateAction>[] = []; 

                const isFetchingModels: IsFetchingModelsAction = {
                    type: IsFetchingModelsAction, fetchingStatus: {}
                }

                for(const prop of action.props){
                    if(stateSnapshot[prop] || (stateSnapshot.fetchingStatus && stateSnapshot.fetchingStatus[prop] === "fetching")) continue;

                    const modelCfg = _getModelConfig<any,any, ModelFetcherConfig>(prop);
                    if(!this.isFetchable(modelCfg)) continue;

                    isFetchingModels.fetchingStatus[prop] = "fetching";

                    let fetcher = this.fetch$(modelCfg, prop);

                    if(this.retryStrategy) 
                        fetcher = fetcher.pipe(retryWhen(this.retryStrategy));

                    fetchers.push(fetcher.pipe(
                        map(payload => <ModelFetchingSucceededAction> { type: ModelFetchingSucceededAction, payload, stateProp: prop }),
                        catchError(e => of(<ModelFetchingFailedAction> { type: ModelFetchingFailedAction, stateProp: prop }))
                    ))
                }
                if(fetchers.length) return merge(of(isFetchingModels), ...fetchers)
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