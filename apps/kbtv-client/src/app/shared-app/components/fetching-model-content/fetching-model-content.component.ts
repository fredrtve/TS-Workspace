import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeviceInfoService } from '@core/services/device-info.service';
import { ModelState } from '@core/state/model-state.interface';
import { Prop } from '@fretve/global-types';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'state-management';
import { FetchingStatus, StateFetchingStatus } from 'model/state-fetcher';

@Component({
  selector: 'app-fetching-model-content',
  templateUrl: './fetching-model-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FetchingModelContentComponent{
    @Input() modelProp: Prop<ModelState>;

    vm$: Observable<{isOnline: boolean, fetchingStatus: FetchingStatus | null }> = combineLatest([
        this.store.selectProperty$('fetchingStatus'),
        this.deviceInfoService.isOnline$
    ]).pipe(
        map(([fetchingStatusMap, isOnline]) => { return { 
            fetchingStatus: !fetchingStatusMap ? null : fetchingStatusMap[this.modelProp], 
            isOnline 
        }})
    )

    constructor(
        private store: Store<StateFetchingStatus<ModelState>>,
        private deviceInfoService: DeviceInfoService,
    ){}
}
