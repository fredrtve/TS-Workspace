import { Provider } from '@angular/core';
import { STORE_EFFECTS, STORE_REDUCERS } from '@state/constants/injection-tokens.const';
import { DeleteModelHttpEffect } from './delete-model/delete-model.http.effect';
import { DeleteModelReducer } from './delete-model/delete-model.reducer';
import { FetchModelsHttpEffect } from './fetch-model/fetch-models.http.effect';
import { SetFetchedModelReducer } from './fetch-model/set-fetched-model.reducer';
import { MailModelsHttpEffect } from './mail-models/mail-models.http.effect';
import { SaveModelHttpEffect } from './save-model/save-model.http.effect';
import { SaveModelReducer } from './save-model/save-model.reducer';

export const SaveModelProviders: Provider[] = [
    {provide: STORE_EFFECTS, useClass: SaveModelHttpEffect, multi: true},
    {provide: STORE_REDUCERS, useValue: SaveModelReducer, multi: true},
]

export const DeleteModelProviders: Provider[] = [
    {provide: STORE_EFFECTS, useClass: DeleteModelHttpEffect, multi: true},
    {provide: STORE_REDUCERS, useValue: DeleteModelReducer, multi: true},
]

export const MailModelsProviders: Provider[] = [
    {provide: STORE_EFFECTS, useClass: MailModelsHttpEffect, multi: true},
]

export const FetchModelsProviders: Provider[] = [
    {provide: STORE_EFFECTS, useClass: FetchModelsHttpEffect, multi: true},
    {provide: STORE_REDUCERS, useValue: SetFetchedModelReducer, multi: true},
]