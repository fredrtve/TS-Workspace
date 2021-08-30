import { fromEvent, merge, of } from "rxjs";
import { first, map } from "rxjs/operators";

export const awaitOnline = () => merge(
    fromEvent(window, 'online').pipe(map(() => true)),
    of(navigator.onLine)
).pipe(
    first(isOnline => isOnline === true),
)
        