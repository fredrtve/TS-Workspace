import { Injectable } from '@angular/core';
import { GlobalActions } from '@core/global-actions';
import { map, mergeMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { ModelBaseUrls } from '../../configurations/model/model-base-urls.const';
import { ApiService } from '../../services/api.service';
import { MailModelsHttpRequest } from './mail-models-http-request.interface';

@Injectable()
export class MailModelsHttpEffect implements Effect{

    constructor(private apiService: ApiService) {}
    
    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([GlobalActions.mailModels]),
            mergeMap(({action}) => 
                this.apiService.post<void>(
                    ModelBaseUrls[action.stateProp] + "/Mail", 
                    <MailModelsHttpRequest> {ids: action.ids, toEmail: action.toEmail}
                )),
        )
    }
}