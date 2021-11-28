import { Inject, Injectable, Optional, Self } from "@angular/core";
import { Immutable, ImmutableArray } from "@fretve/global-types";
import { StateAction } from "state-management";
import { ACTION_REQUEST_MAP, OPTIMISTIC_STATE_PROPS } from "./constants/injection-tokens.const";
import { ActionRequestMap } from "./interfaces";
import { OptimisticProvidersService } from "./optimistic-providers.service";

@Injectable()
export class OptimisticFeatureProvidersService {

    constructor(
        @Self() @Inject(OPTIMISTIC_STATE_PROPS) @Optional() stateProps: ImmutableArray<string>,
        @Self() @Inject(ACTION_REQUEST_MAP) @Optional() actionMap: Immutable<ActionRequestMap<StateAction>>,
        optimisticProvidersService: OptimisticProvidersService
    ){
        if(actionMap) optimisticProvidersService.registerActionRequestMap(actionMap)
        if(stateProps) optimisticProvidersService.registerStateProps(stateProps)
    }

}