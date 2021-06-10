import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommandIdHeader } from '@core/configurations/command-id-header.const';
import { AppOptimisticHttpRequest } from '@core/configurations/model/model-requests.interface';
import { StateMissions } from '@core/state/global-state.interfaces';
import { AppRequestDescriberMap } from '@shared-app/constants/app-request-describer-map.const';
import { Immutable } from 'global-types';
import { CompletedCommand } from 'optimistic-http';

@Component({
  selector: 'app-completed-request-log-list.',
  templateUrl: './completed-request-log-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletedRequestLogListComponent {
  AppRequestDescriberMap = AppRequestDescriberMap;
  
  @Input() requests: CompletedCommand[];
  @Input() state: Immutable<StateMissions>
  
  constructor() {}
  
  trackByReq = (index:number, cmd: CompletedCommand) => 
    (<AppOptimisticHttpRequest> cmd.request).headers[CommandIdHeader];

}
