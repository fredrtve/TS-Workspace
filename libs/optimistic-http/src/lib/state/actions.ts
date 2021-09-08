import { HttpErrorResponse } from "@angular/common/http";
import { Immutable } from "global-types";
import { _createAction, _payload } from "state-management";
import { CompletedCommand, OptimisticHttpRequest, QueuedCommand } from "../interfaces";

export const OptimisticActions = {
    dispatchNext: _createAction("Dispatch Next Request"),
    httpError: _createAction("Http Error", _payload<HttpErrorPayload>()),
    optimisticHttpError: _createAction("Optimistic Http Error", _payload<OptimisticHttpErrorPayload>()),
    queuePush: _createAction("Http Queue Push", _payload<{command: QueuedCommand}>()),
    queueShift: _createAction("Http Queue Shift"),
    appendLog: _createAction("Append Request Log", _payload<{completedCommands: CompletedCommand[]}>()),
}

export const _optimisticHttpRequest = _createAction(
    "Optimistic Http Request", 
    _payload<OptimisticHttpRequestPayload>()
)

/** Represents the action dispatched when there are http errors returned from optimistic requests.
 *  Triggers the {@link OptimisticHttpError} action. */
export interface HttpErrorPayload  {
    /** The error response from the external api */
    httpError: HttpErrorResponse,
}

/** Represents an optimistic error containing both the triggering http error command & any canceled commands */
export interface OptimisticHttpErrorPayload extends HttpErrorPayload{
    canceledCommands: CompletedCommand[];
    errorCommand: CompletedCommand;
}

/** Represents an action payload used to make an optimistic http request. */
export interface OptimisticHttpRequestPayload {
    /** The request that should be sent */
    request: OptimisticHttpRequest, 
    /** A snapshot that is used to revert state in case of errors. */
    stateSnapshot: Immutable<{}>
}