import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { translations } from '@shared-app/constants/translations.const';
import { _registerModelStateConfig } from 'model/core';
import { MODEL_PROP_TRANSLATIONS } from 'model/shared';
import { MODEL_FETCHER_BASE_URL } from 'model/state-fetcher';
import { OPTIMISTIC_BASE_API_URL, OptimisticHttpModule } from 'optimistic-http';
import { environment } from 'src/environments/environment';
import { HttpAuthTokensInterceptor, StateAuthModule } from 'state-auth';
import { StateDbModule, STATE_DB_CONFIG } from 'state-db';
import { StateManagementModule, STORE_SETTINGS } from 'state-management';
import { StateSyncModule } from 'state-sync';
import { AppAuthCommandApiMap } from './configurations/app-auth-command-api-map.const';
import { AppAuthRedirects } from './configurations/app-auth-redirects.const';
import { AppStateDbConfig } from './configurations/app-state-db-config.const';
import { AppStoreSettings } from './configurations/app-store-settings.const';
import { AppSyncStateConfig } from './configurations/app-sync-state.config';
import { DefaultState } from './configurations/default-state.const';
import { ModelConfigMap } from './configurations/model/app-model-configs.const';
import { AppOptimisticStateProps } from './configurations/optimistic/app-optimistic-state.const';
import { HttpRetryInterceptor } from './interceptors/http-retry.interceptor';
import { HttpErrorInterceptor } from './interceptors/http.error.interceptor';
import { HttpIsOnlineInterceptor } from './interceptors/http.is-online.interceptor';
import { HttpLoadingInterceptor } from './interceptors/http.loading.interceptor';
import { GlobalErrorHandler } from './services/global-error.handler';
import { StartupService } from './services/startup.service';
import { SyncHttpFetcherService } from './services/sync-http-fetcher.service';
import { InitalizeHttpQueueEffect, InitalizeSyncEffect } from './state/initalizing.effects';
import { NotifyOnUnauthorizedEffect } from './state/notify-on-unauthorized.effect';
import { OpenDialogOnOptimisticError } from './state/open-dialog-on-optimistic-error.effect';
import { SetSyncModelsFetchedReducer, SetSyncModelsFetchingReducer } from './state/sync-fetching.reducer';
import { SyncUserOnLoginEffect } from './state/sync-user-on-login.effect';
import { WipeStateReducer } from './state/wipe-state.reducer';

_registerModelStateConfig(ModelConfigMap);

@NgModule({
  declarations: [],
  imports: [
    StateManagementModule.forRoot({
      defaultState: DefaultState,
      reducers: [WipeStateReducer, SetSyncModelsFetchedReducer, SetSyncModelsFetchingReducer],
      effects: [InitalizeSyncEffect, InitalizeHttpQueueEffect, OpenDialogOnOptimisticError, 
        SyncUserOnLoginEffect, NotifyOnUnauthorizedEffect],
    }),
    StateSyncModule.forRoot({
      fetcher: SyncHttpFetcherService,
      config: AppSyncStateConfig
    }),
    StateAuthModule.forRoot(AppAuthCommandApiMap, AppAuthRedirects),
    StateDbModule,  
    OptimisticHttpModule.forRoot(null, AppOptimisticStateProps)
  ],
  providers: [   
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },   
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthTokensInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },  
    { provide: HTTP_INTERCEPTORS, useClass: HttpRetryInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpIsOnlineInterceptor, multi: true }, 

    { provide: STORE_SETTINGS, useValue: AppStoreSettings},
    
    { provide: OPTIMISTIC_BASE_API_URL, useValue: environment.apiUrl},
    { provide: MODEL_FETCHER_BASE_URL, useValue: environment.apiUrl},

    { provide: MODEL_PROP_TRANSLATIONS, useValue: translations },

    { provide: STATE_DB_CONFIG, useValue: AppStateDbConfig},  
  ]
})
export class CoreModule { 
  constructor(startupService: StartupService){}
}
