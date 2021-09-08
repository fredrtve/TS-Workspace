import { NgModule } from '@angular/core';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { ModelCommandReducers } from './state/reducers';
import { SaveModelEffect } from './state/save-model.effect';

/** Responsible for providing reducers and effects for deleting & saving models.  */
@NgModule({
    declarations: [],
    imports: [],
    providers: [
        { provide: STORE_REDUCERS, useValue: ModelCommandReducers, multi: true},
        { provide: STORE_EFFECTS, useClass: SaveModelEffect, multi: true }
    ],
})
export class ModelStateCommandsModule { }
  