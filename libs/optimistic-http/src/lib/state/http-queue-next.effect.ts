import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { HttpQueuer } from '../http.queuer';
import { OptimisticActions } from './actions';

@Injectable()
export class HttpQueueNextEffect implements Effect {

    constructor(private httpQueuer: HttpQueuer) {}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([OptimisticActions.queueShift]),
            map(x => this.httpQueuer.next())
        )
    }

}