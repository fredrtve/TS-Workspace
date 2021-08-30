import { ApplicationRef, Injectable } from "@angular/core";
import { concat, interval, Subscription } from "rxjs";
import { first, tap } from 'rxjs/operators';
import { Store } from 'state-management';
import { SyncStateAction } from './state/actions';
import { StoreState } from "./store-state.interface";

/** Root service responsible for keeping system synchronized */
@Injectable({providedIn: "root"})
export class ContinousSyncService {

    private get syncTimestamp() { return this.store.state.syncTimestamp }

    private continousSyncSub: Subscription | undefined;

    constructor(
        private appRef: ApplicationRef,
        private store: Store<StoreState>,
    ) { }
  
    /** Starts the synchronization clock. */
    start(): void {
      this.syncAll()
      this.continousSyncSub = this.continousSync$.subscribe();
    }

    /** Stops the synchronization clock. */
    stop(): void { this.continousSyncSub?.unsubscribe(); }
      
    private get continousSync$(){
        const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
        const continousSync$ = interval(1000*60*3).pipe(tap(x => this.syncIfTimePassed()));  
        return concat(appIsStable$, continousSync$);
    }

    private syncIfTimePassed = (): void => {
      const timeSinceLastSync = new Date().getTime() - (this.syncTimestamp || 0);
      const syncConfig = this.store.state.syncConfig;
      if(!syncConfig || (timeSinceLastSync > syncConfig.refreshTime)) this.syncAll();             
    }

    private syncAll = () : void => this.store.dispatch(<SyncStateAction>{ type: SyncStateAction })
}