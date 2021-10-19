import { Observable, concat, asyncScheduler } from "rxjs";
import { take, skip, debounceTime } from "rxjs/operators";

export const debounceAfterFirst = <T>(delay: number) => 
    (source: Observable<T>): Observable<T> => 
        concat(
            source.pipe(take(1)),
            source.pipe(skip(1), debounceTime(delay, asyncScheduler))
        ) 
        