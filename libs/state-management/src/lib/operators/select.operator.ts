import { Immutable, Prop, UnknownState } from "@fretve/global-types";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { _selectSlice } from "../helpers/select-slice.helper";
import { StateSlice } from "../interfaces";

/** An rxjs operator used to select a specified slice from state 
 *  and only emit when its value changes.
 * @param props - The properties on state that should be selected.
 * @returns The slice of state that corresponds with the specified properties
 */
export const select = <TState, TProps extends Prop<TState>[] = Prop<TState>[]>(props: Prop<TState>[]) => 
    (source: Observable<Immutable<TState>>): Observable<Immutable<StateSlice<TState, TProps>>> => 
        source.pipe(
            distinctUntilChanged((a, b) => {
                let exp = true;
                for(const prop of props) exp = exp && ((<UnknownState>a)[prop] === (<UnknownState>b)[prop]);
                return exp;
            }),
            map(x => _selectSlice(x, props))
        )