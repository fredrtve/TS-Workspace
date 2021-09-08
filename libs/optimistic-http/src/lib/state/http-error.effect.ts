import { Injectable } from "@angular/core"
import { of } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { DispatchedActions, Effect, listenTo } from "state-management"
import { CompletedCommand, StateRequestQueue } from "../interfaces"
import { OptimisticActions } from "./actions"
@Injectable()
export class HttpErrorEffect implements Effect {

    constructor() { }

    handle$(actions$: DispatchedActions<StateRequestQueue>) {
        return actions$.pipe(
            listenTo([OptimisticActions.httpError]),
            mergeMap(x => {
                const completedCommands = x.stateSnapshot.requestQueue.map(
                    ({request}) => { return <CompletedCommand> { request, succeeded: false } }
                )

                const canceledCommands = completedCommands.slice();
                const errorCommand = <CompletedCommand> canceledCommands.shift();

                return of(
                    OptimisticActions.optimisticHttpError({errorCommand, canceledCommands, httpError: x.action.httpError}), 
                    OptimisticActions.appendLog({completedCommands})
                );
            })
        )
    }
}