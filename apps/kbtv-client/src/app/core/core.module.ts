import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppModelStatePropTranslations } from '@shared-app/constants/model-state-prop-translations.const';
import { translations } from '@shared-app/constants/translations.const';
import { _registerModelStateConfig } from 'model/core';
import { MODEL_PROP_TRANSLATIONS, MODEL_STATE_PROP_TRANSLATIONS } from 'model/shared';
import { MODEL_FETCHER_BASE_URL, MODEL_FETCHER_RETRY_STRATEGY } from 'model/state-fetcher';
import { OptimisticHttpModule } from 'optimistic-http';
import { environment } from 'src/environments/environment';
import { HttpAuthTokensInterceptor, StateAuthModule } from 'state-auth';
import { StateDbModule } from 'state-db';
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
import { httpRetryStrategy } from './http-retry.strategy';
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
import { CoreReducers } from './state/reducers';
import { SyncUserOnLoginEffect } from './state/sync-user-on-login.effect';

_registerModelStateConfig(ModelConfigMap);

@NgModule({
  declarations: [],
  imports: [
    StateManagementModule.forRoot({
      defaultState: DefaultState,
      reducers: CoreReducers,
      effects: [InitalizeSyncEffect, InitalizeHttpQueueEffect, OpenDialogOnOptimisticError, 
        SyncUserOnLoginEffect, NotifyOnUnauthorizedEffect],
    }),
    StateSyncModule.forRoot({
      fetcher: SyncHttpFetcherService,
      config: AppSyncStateConfig
    }),
    StateAuthModule.forRoot(AppAuthCommandApiMap, AppAuthRedirects),
    StateDbModule.forRoot(AppStateDbConfig),  
    OptimisticHttpModule.forRoot(null, AppOptimisticStateProps, environment.apiUrl)
  ],
  providers: [   
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },   
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthTokensInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },  
    { provide: HTTP_INTERCEPTORS, useClass: HttpRetryInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpIsOnlineInterceptor, multi: true }, 

    { provide: STORE_SETTINGS, useValue: AppStoreSettings},
    
    { provide: MODEL_FETCHER_BASE_URL, useValue: environment.apiUrl},
    { provide: MODEL_FETCHER_RETRY_STRATEGY, useValue: httpRetryStrategy({excludedStatusCodes: [401]}) },
    { provide: MODEL_PROP_TRANSLATIONS, useValue: translations },
    { provide: MODEL_STATE_PROP_TRANSLATIONS, useValue: AppModelStatePropTranslations }
  ]
})
export class CoreModule { 
  constructor(startupService: StartupService){}
}
