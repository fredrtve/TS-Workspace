import { Injectable } from '@angular/core';
import { awaitOnline } from 'global-utils';
import { BehaviorSubject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Store } from 'state-management';
import { StateRequestQueue } from './interfaces';
import { OptimisticActions } from './state/actions';

/** Class responsible for queuing and dispatching http requests ({@link OptimisticHttpRequest}) 
 * Requires initalization by consumer. */
@Injectable({ providedIn: 'root' })
export class HttpQueuer {

  private nextInQueueSubject = new BehaviorSubject<boolean>(true);

  private nextInQueue$ = this.nextInQueueSubject.asObservable().pipe(
    map(x => this.store.state.requestQueue),
    filter(x => x != null && x.length > 0),
    switchMap(queue => 
      awaitOnline().pipe(
        tap(x => queue ? this.dispatchNextRequest() : null)
      )
    )
  );

  constructor(private store: Store<StateRequestQueue>) {}

  /** Initalizes the queue */
  initalize(): void {
    this.nextInQueue$.subscribe();
  }

  /** Allows the next in queue to execute. Should be called cautiously.  */
  next(): void {
    this.nextInQueueSubject.next(true)
  }

  private dispatchNextRequest(): void{
    this.store.dispatch(OptimisticActions.dispatchNext());
  }

}
