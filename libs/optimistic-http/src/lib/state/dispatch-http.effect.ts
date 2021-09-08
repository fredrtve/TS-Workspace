import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo, StateAction } from 'state-management';
import { HttpFactoryService } from '../http-factory.service';
import { StateRequestQueue } from '../interfaces';
import { OptimisticActions } from './actions';

@Injectable()
export class DispatchHttpEffect implements Effect {

    constructor(private httpFactory: HttpFactoryService) {}

    handle$(actions$: DispatchedActions<StateRequestQueue>) {
        return actions$.pipe(
            listenTo([OptimisticActions.dispatchNext]),
            mergeMap(x => {
                const command = x.stateSnapshot.requestQueue[0];
                return this.httpFactory.getObserver$(command.request).pipe(map(result => { return {result, command} } ))
            }),
            mergeMap(x =>{ 
                const actions: StateAction[] = [OptimisticActions.queueShift()];
                if(!x.result?.isDuplicate){
                    actions.push(OptimisticActions.appendLog({
                        completedCommands: [{
                            request: x.command.request,  
                            succeeded: true
                        }]
                    }));
                }
                return of(...actions);
            })
        )
    }

    onErrorAction = (httpError: HttpErrorResponse) => OptimisticActions.httpError({httpError});

}