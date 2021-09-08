import { NgModule } from '@angular/core';
import { STORE_REDUCERS } from 'state-management';
import { StatePersisterService } from './state-persister.service';
import { StateReaderService } from './state-reader.service';
import { DbReducers } from './state/reducers';

/** Responsible for injecting core providers. Should only be imported in root. */
@NgModule({
  declarations: [],
  imports: [],
  providers: [
      {provide: STORE_REDUCERS, useValue: DbReducers, multi: true},
  ]
})
export class StateDbModule { 
  constructor(
    statePersisterService: StatePersisterService,
    stateReaderService: StateReaderService
  ){}
}
