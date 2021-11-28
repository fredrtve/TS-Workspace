import { Inject, Injectable, Optional } from "@angular/core";
import { Immutable, ImmutableArray, Prop } from "@fretve/global-types";
import { StateAction } from "state-management";
import { ACTION_REQUEST_MAP, OPTIMISTIC_STATE_PROPS } from "./constants/injection-tokens.const";
import { ActionRequestMap } from "./interfaces";

@Injectable({ providedIn: "root" })
export class OptimisticProvidersService {

    private _optimisticStateProps: ImmutableArray<string>;
    get optimisticStateProps(): ImmutableArray<string> {
        return this._optimisticStateProps;
    }

    private _actionMap: Immutable<ActionRequestMap<StateAction>>;
    get actionMap(): Immutable<ActionRequestMap<StateAction>> {
        return this._actionMap;
    }
    
    constructor(
        @Inject(OPTIMISTIC_STATE_PROPS) @Optional() stateProps: ImmutableArray<string>,
        @Inject(ACTION_REQUEST_MAP) @Optional() actionMap: Immutable<ActionRequestMap<StateAction>>
    ){
        this._optimisticStateProps = stateProps || [];
        this._actionMap = actionMap || {};
    }

    registerStateProps<TState>(props: ImmutableArray<Prop<TState>>): void{
        this._optimisticStateProps = [...this._optimisticStateProps, ...props]
    }
    
    registerActionRequestMap(actionMap: ActionRequestMap<StateAction>): void{
        this._actionMap = {...this._actionMap, ...actionMap}
    }

}