import { ModuleWithProviders, NgModule } from '@angular/core';
import { STORE_REDUCERS } from 'state-management';
import { STATE_DB_CONFIG } from './injection-tokens.const';
import { StateDbConfig } from './interfaces';
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

  static forRoot<TState>(dbConfig: StateDbConfig<TState>): ModuleWithProviders<StateDbModule> {
      return {
          ngModule: StateDbModule,
          providers: [
            { provide: STORE_REDUCERS, useValue: DbReducers, multi: true },
            { provide: STATE_DB_CONFIG, useValue: dbConfig }
          ]
      }
  }
}
