import { Provider } from '@angular/core';
import { STORE_EFFECTS, STORE_REDUCERS } from 'state-management';
import { FetchTimesheetsHttpEffect } from './effects';
import { SetFetchedTimesheetsReducer, SetCriteriaCacheReducer, RemoveCriteriaCacheReducer, SetTimesheetFetchingFailedReducer } from './reducers.const';

export const FetchTimesheetProviders: Provider[] = [
    {provide: STORE_EFFECTS, useClass: FetchTimesheetsHttpEffect, multi: true},
    {provide: STORE_REDUCERS, useValue: SetFetchedTimesheetsReducer, multi: true},
    {provide: STORE_REDUCERS, useValue: SetCriteriaCacheReducer, multi: true},
    {provide: STORE_REDUCERS, useValue: RemoveCriteriaCacheReducer, multi: true},
    {provide: STORE_REDUCERS, useValue: SetTimesheetFetchingFailedReducer, multi: true},

]