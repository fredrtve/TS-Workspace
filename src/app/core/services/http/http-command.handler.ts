import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { NotificationService, NotificationType } from 'src/app/shared-app/notification';
import { User } from '../../models/user.interface';
import { ApiService } from '../api.service';
import { DeviceInfoService } from '../device-info.service';
import { ObservableStore } from '../state/abstracts/observable-store';
import { StateCurrentUser } from '../state/interfaces/global-state.interfaces';
import { ObservableStoreBase } from '../state/observable-store-base';
import { SyncStore } from '../sync';
import { HttpCommand } from './http-command.interface';

interface State extends StateCurrentUser { requestQueue: QueuedCommand[]; };

interface QueuedCommand { command: HttpCommand, stateSnapshot: any, dispatched?: boolean };

@Injectable({ providedIn: 'root' })
export class HttpCommandHandler extends ObservableStore<State> {

  private get requestQueue(): QueuedCommand[] {
    return this.getStateProperty<QueuedCommand[]>("requestQueue", false) || [];
  }

  private nextInQueueSubject = new BehaviorSubject<boolean>(null);

  private nextInQueue$ = this.nextInQueueSubject.asObservable().pipe(
    map(x => this.requestQueue[0]),
    filter(x => x != null),
    tap(queued => this.dispatchHttp(queued.command))
  );

  constructor(
    base: ObservableStoreBase,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private deviceInfoService: DeviceInfoService,
    syncStore: SyncStore) {
    super(base);

    syncStore.hasInitialSynced$.subscribe(x => {
      this.checkDispatchedRequest();
      this.nextInQueue$.subscribe();
    });

  }

  handle(command: HttpCommand, stateSnapshot?: any): void {
    if (!command)
      console.error("No state http command provided");

    //If no state changes, ignore queue and run request
    if (!stateSnapshot) {
      this.getHttpCommandObserver(command).subscribe();
      return;
    };

    const requestQueue = this.requestQueue;
    requestQueue.push({ command, stateSnapshot });

    this.setState({ requestQueue }, null, false); //No need to deep clone request queue

    if (requestQueue.length === 1)
      this.nextInQueueSubject.next(true);
  }

  private dispatchHttp(command: HttpCommand) {
    this.deviceInfoService.isOnline$.pipe(
      first(x => x === true), //Wait for online
      tap(x => this.setFirstRequestDispatched()),
      switchMap(x => this.getHttpCommandObserver(command)),
      catchError(err => this.onHttpError(true)),
      tap(x => this.onHttpSuccess()) //Add next id to queue)
    ).subscribe();
  }

  private setFirstRequestDispatched(): void{
    const requestQueue = this.requestQueue;
    const request = requestQueue[0];
    if(!request) return;
    requestQueue[0] = {...request, dispatched: true};
    this.setState({ requestQueue }, null, false); //No need to deep clone request queue
  }

  private onHttpSuccess() {
    const requestQueue = this.requestQueue;
    requestQueue.shift();
    this.setState({ requestQueue }, null, false);
    this.nextInQueueSubject.next(true);
  }

  private onHttpError(ignoreInitial?: boolean, customTitle?: string): Observable<void> {
    const requestQueue = this.requestQueue;
    const currentRequest = requestQueue[0];

    if (currentRequest.stateSnapshot)
      this.setState({ ...currentRequest.stateSnapshot, requestQueue: [] }, null, true);

    let errorMessages = requestQueue.map(x => x.command.cancelMessage);
    if (ignoreInitial)
      errorMessages.shift();

    if (errorMessages.length > 0)
      this.notificationService.notify({
        title: customTitle || "Følgefeil!",
        details: errorMessages,
        type: NotificationType.Error,
        duration: errorMessages.length * 2500
      });

    return EMPTY;
  }

  //Checks if there are dispatched requests persisted when initalizing. 
  //i.e. if app is closed while request is processing
  //Waits for sync call to provide last command status for user, to check if it was successful or not. 
  private checkDispatchedRequest(): void {
    const requestQueue = this.requestQueue
    const firstRequest = requestQueue[0];
    if(!firstRequest?.dispatched) return; //Only check dispatched requests

    const lastCommandStatus = this.getStateProperty<User>("currentUser", false)?.lastCommandStatus;

    if (!lastCommandStatus) 
      this.onHttpError(false, "Noe gikk feil ved forrige økt!");
    else{
      requestQueue.shift(); //If successfull just remove 
      this.setState({requestQueue})
    }
  }

  private getHttpCommandObserver(command: { httpMethod: "POST" | "PUT" | "DELETE"; apiUrl: string; httpBody: any; }) {
    switch (command.httpMethod) {
      case "POST": return this.apiService.post(command.apiUrl, command.httpBody);
      case "PUT": return this.apiService.put(command.apiUrl, command.httpBody);
      case "DELETE": return this.apiService.delete(command.apiUrl);
    }
  }
}
