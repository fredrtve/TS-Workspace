import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeviceInfoService } from '@core/services/device-info.service';
import { StateMissions } from '@core/state/global-state.interfaces';
import { _groupBy } from '@fretve/array-helpers';
import { Immutable, ImmutableArray } from '@fretve/global-types';
import { CompletedCommand, QueuedCommand, StateRequestLog, StateRequestQueue } from 'optimistic-http';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'state-management';

interface ViewModel { 
  requestQueue?: ImmutableArray<QueuedCommand>;
  completedRequests?: ImmutableArray<CompletedCommand>; 
  failedRequests?: ImmutableArray<CompletedCommand>;
  isOnline: boolean;
}

@Component({
  selector: 'app-request-log',
  templateUrl: './request-log.component.html',
  styleUrls: ['./request-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestLogComponent {

  private sortedRequestLog$: Observable<Partial<ViewModel>> = this.store.selectProperty$("requestLog").pipe(
    map(x => {
      const grouped = _groupBy(x, "succeeded");
      return { completedRequests: grouped['true'], failedRequests: grouped['false'] }
    })
  );

  vm$: Observable<ViewModel> = combineLatest([
    this.store.selectProperty$("requestQueue"),
    this.sortedRequestLog$,
    this.deviceInfoService.isOnline$
  ]).pipe(map(([requestQueue, sortedLog, isOnline]) => { return {requestQueue, isOnline, ...sortedLog}}));

  state: Immutable<StateMissions>;

  constructor(
    private store: Store<StateRequestLog & StateRequestQueue & StateMissions>,
    private deviceInfoService: DeviceInfoService
  ) {
    this.state = {missions: this.store.state.missions};
  }

}
