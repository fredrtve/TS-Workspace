import { Immutable, Prop, UnknownState } from "@fretve/global-types";
import { StateSlice } from "../interfaces";

export function _selectSlice<TState, TProps extends Prop<TState>[] = Prop<TState>[]>(
    state: Immutable<TState>,
    props: Prop<TState>[]
): Immutable<StateSlice<TState, TProps>> {
    const returnState: Partial<UnknownState> = {}
    for(const prop of props) returnState[prop] = state[<Prop<Immutable<TState>>> prop];
    return <Immutable<StateSlice<TState, TProps>>> returnState;
}