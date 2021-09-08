import { Injectable } from '@angular/core';
import { ApiUrl } from '@core/api-url.enum';
import { User } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { ModelState } from '@core/state/model-state.interface';
import { _saveModel } from 'model/core';
import { map, mergeMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { UserActions } from './actions.const';

@Injectable()
export class SaveUserEffect implements Effect {

    constructor(){}

    handle$(actions$: DispatchedActions<ModelState>) {
        return actions$.pipe(
            listenTo([UserActions.saveUser]),
            map(x => UserActions.setSaveUser({ 
                saveAction: x.action.saveAction,
                password: x.action.password,
                saveModelResult: _saveModel<ModelState, User>(x.stateSnapshot, "users", x.action.entity),
            }))
        )
    }
}

@Injectable()
export class UpdateUserPasswordHttpEffect implements Effect {

    constructor(private apiService: ApiService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([UserActions.updatePassword]),
            mergeMap(({action}) => 
                this.apiService.put<void>(`${ApiUrl.Users}/${action.userName}/NewPassword`, action)),
        )
    }
}