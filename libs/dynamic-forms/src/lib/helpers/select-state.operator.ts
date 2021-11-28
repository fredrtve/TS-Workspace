import { Immutable, ImmutableArray, Prop, UnionTupleType, UnknownState } from "@fretve/global-types";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

type StateSlice<TState, TProps extends Prop<TState>[]> = {
    [P in UnionTupleType<TProps>]: TState[P];
};

/** An rxjs operator used to select a specified slice from state 
 *  and only emit when its value changes.
 * @param props - The properties on state that should be selected.
 * @returns The slice of state that corresponds with the specified properties
 */
 export const selectState = <TState, TProps extends Prop<TState>[] = Prop<TState>[]>(props: ImmutableArray<Prop<TState>>) => 
 (source: Observable<Immutable<TState>>): Observable<Immutable<StateSlice<TState, TProps>>> => 
     source.pipe(
         distinctUntilChanged((a, b) => {
             let exp = true;
             for(const prop of props) exp = exp && ((<UnknownState>a)[prop] === (<UnknownState>b)[prop]);
             return exp;
         }),
         map(state => {
            if(!state) return <Immutable<StateSlice<TState, TProps>>> {};
            const returnState: Partial<UnknownState> = {}
            for(const prop of props) returnState[prop] = state[<Prop<Immutable<TState>>> prop];
            return <Immutable<StateSlice<TState, TProps>>> returnState;
         })
     )