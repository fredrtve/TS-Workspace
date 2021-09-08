import { ModuleWithProviders, NgModule } from '@angular/core';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { SYNC_HTTP_FETCHER, SYNC_STATE_CONFIG } from './injection-tokens.const';
import { CustomSyncProviders } from './interfaces';
import { SyncReducers } from './state/reducers';
import { ReloadSyncStateEffect } from './state/reload-sync-state.effect';
import { SyncStateHttpEffect } from './state/sync-state.http.effect';
import { UpdateSyncConfigEffect } from './state/update-sync-config.effect';

/** Responsible for providing root injectables using the forRoot method. */
@NgModule({})
export class StateSyncModule { 
    static forRoot(providers: CustomSyncProviders): ModuleWithProviders<StateSyncModule> {
        return {
            ngModule: StateSyncModule,
            providers: [
                {provide: STORE_REDUCERS, useValue: SyncReducers, multi: true},

                {provide: STORE_EFFECTS, useClass: SyncStateHttpEffect, multi: true},
                {provide: STORE_EFFECTS, useClass: UpdateSyncConfigEffect, multi: true},
                {provide: STORE_EFFECTS, useClass: ReloadSyncStateEffect, multi: true},

                {provide: SYNC_HTTP_FETCHER, useClass: providers.fetcher},
                {provide: SYNC_STATE_CONFIG, useValue: providers.config}
            ]
        }
    }
}
