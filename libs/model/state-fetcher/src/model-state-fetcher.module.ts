import { NgModule } from '@angular/core';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { FetchModelsHttpEffect } from './fetch-models.http.effect';
import { ModelFetcherReducers } from './state/reducers';

/** Responsible for providing reducers and effects for fetching models. */
@NgModule({
    declarations: [],
    imports: [],
    providers: [
        { provide: STORE_EFFECTS, useClass: FetchModelsHttpEffect, multi: true },
        { provide: STORE_REDUCERS, useValue: ModelFetcherReducers, multi: true },
    ],
})
export class ModelStateFetcherModule { }
  