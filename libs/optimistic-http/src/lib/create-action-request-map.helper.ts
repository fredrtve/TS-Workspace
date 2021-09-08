import { UnknownState } from "global-types";
import { ActionCreator, InferCreatorAction, InferCreatorType, StateAction } from "state-management";
import { ActionRequestConverterFn, ActionRequestMap } from "./interfaces";

/** Helper function that creates a map for action request converters
 *  @param {...*} entries - The entries for the map. See {@link _entry}
 *  @returns A map of action types and converters. */
 export const _createActionRequestMap = (
     ...entries: ActionRequestMapEntry<ActionCreator<any,any>>[]
    ): ActionRequestMap<StateAction> => { 
    const map : UnknownState = {};
    for(const entry of entries) map[<string> entry.type] = entry.converter;
    return <ActionRequestMap<StateAction>> map;
}

/** Helper function that creates a entry for an action request map
 *  with {@link _createActionRequestMap}
 *  @param action - The action creator function
 *  @param converter - The converter function
 *  @returns An entry. */
export const _entry = <TActionCreator extends ActionCreator<any,any>>(
    action: TActionCreator, 
    converter: ActionRequestConverterFn<InferCreatorAction<TActionCreator>> 
): ActionRequestMapEntry<TActionCreator> => { 
    return {type: action({}).type, converter} 
}

interface ActionRequestMapEntry<TActionCreator extends ActionCreator<any,any>>{ 
    type: InferCreatorType<TActionCreator>, 
    converter : ActionRequestConverterFn<InferCreatorAction<TActionCreator>> 
}