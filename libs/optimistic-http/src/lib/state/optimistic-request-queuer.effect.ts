import { Injectable } from '@angular/core';
import { Immutable, UnknownState } from '@fretve/global-types';
import { map } from 'rxjs/operators';
import { ActionCreator, DispatchedAction, DispatchedActions, Effect, StateAction } from 'state-management';
import { ActionRequestConverterFn, OptimisticHttpRequest } from '../interfaces';
import { OptimisticProvidersService } from '../optimistic-providers.service';
import { OptimisticActions, _optimisticHttpRequest } from './actions';

@Injectable()
export class OptimisticRequestQueuerEffect implements Effect {

    constructor(private optimisticProvidersService: OptimisticProvidersService) { }

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(map(x => this.createQueuePushAction(x)))
    }

    private createQueuePushAction(dispatched: DispatchedAction<ActionCreator<any,any>>): StateAction | void {
        if(dispatched.action.type === _optimisticHttpRequest(<any>{}).type) 
            return OptimisticActions.queuePush({command: {
                request: dispatched.action.request, 
                stateSnapshot: this.getOptimisticState(dispatched.action.stateSnapshot),
            }})

        const converter = this.optimisticProvidersService.actionMap[dispatched.action.type];
        if(converter !== undefined) return this.onRequestMapAction(dispatched, converter);
    }

    private onRequestMapAction(dispatched: DispatchedAction<any>, fn: ActionRequestConverterFn<StateAction>) {
        const request = fn(dispatched.action);
        if(!request) return;
        return OptimisticActions.queuePush({command: {
                request: <OptimisticHttpRequest> { ...request },
                stateSnapshot: this.getOptimisticState(dispatched.stateSnapshot),
            }})
    }
    
    private getOptimisticState(state: Immutable<UnknownState>): UnknownState {  
        const stateProps = this.optimisticProvidersService.optimisticStateProps;  
        if(!stateProps.length) return state; 
        let returnState: UnknownState = {};
        for(const prop of stateProps) returnState[prop] = state[prop]; 
        return returnState;
    };

}