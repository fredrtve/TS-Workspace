import { Prop, Immutable } from "@fretve/global-types";
import { Observable } from "rxjs";
import { distinctUntilKeyChanged, map } from "rxjs/operators";

/** An rxjs operator used to select a specified property from state 
 *  and only emit when its value changes.
 * @param prop - The property on state that should be selected.
 * @returns The value that corresponds with the specified property on state
 */
export const selectProp = <TState, TProp extends Prop<Immutable<TState>>>(prop: TProp) => 
    (source: Observable<Immutable<TState>>): Observable<Immutable<TState>[TProp]> => 
        source.pipe(
            distinctUntilKeyChanged(prop),
            map(x => x[prop])
        )

