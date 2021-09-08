import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { HttpQueuer } from '../http.queuer';
import { StateRequestQueue } from '../interfaces';
import { OptimisticActions } from './actions';

@Injectable()
export class HttpQueuePushEffect implements Effect {

    constructor(private httpQueuer: HttpQueuer) {  }

    handle$(actions$: DispatchedActions<StateRequestQueue>) {
        return actions$.pipe(
            listenTo([OptimisticActions.queuePush]),
            map(x => {
                if(!x.stateSnapshot?.requestQueue?.length || !x.stateSnapshot.requestQueue[0].dispatched)
                    this.httpQueuer.next();
            })
        )
    }

}