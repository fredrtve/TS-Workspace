import { Injectable } from '@angular/core';
import { ApiUrl } from '@core/api-url.enum';
import { ApiService } from '@core/services/api.service';
import { map, mergeMap } from 'rxjs/operators';
import { StateDbService } from 'state-db';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { ProfileActions } from './actions.const';

@Injectable()
export class UpdatePasswordHttpEffect implements Effect {

    constructor(private apiService: ApiService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([ProfileActions.updatePassword]),
            mergeMap(({action}) => 
                this.apiService.put<void>(`${ApiUrl.Auth}/changePassword`, action)),
        )
    }

}

@Injectable()
export class ClearAndLogoutEffect implements Effect {

    constructor(private stateDbService: StateDbService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([ProfileActions.clearAndLogout]),
            map(x => {         
                this.stateDbService.clear$().subscribe(x => {
                    window.localStorage.clear();
                    window.location.reload()
                });    
            }),
        )
    }

}