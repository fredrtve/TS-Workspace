import { Immutable } from "@fretve/global-types";

export function _hasSameState<T extends Object>(state1: Immutable<T>, state2: Immutable<T>): boolean{
    const state: Immutable<T> = state1 || {};
    const compareState: Immutable<T> = state2 || {}
    for (var key in state) {  
        const value: Immutable<unknown> = state[key];
        const compareValue: Immutable<unknown> = compareState[key];
        if(value && typeof value === "object") {
            if(!_hasSameState(value, <Immutable<{}>> compareValue)) return false;
        }
        else if(value != compareState[key]) return false;
    }
    return true;
}