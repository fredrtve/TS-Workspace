import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommandIdHeader } from '@core/configurations/command-id-header.const';
import { AppOptimisticHttpRequest } from '@core/configurations/model/model-requests.interface';
import { StateMissions } from '@core/state/global-state.interfaces';
import { AppRequestDescriberMap } from '@shared-app/constants/app-request-describer-map.const';
import { Immutable } from '@fretve/global-types';
import { CompletedCommand } from 'optimistic-http';

@Component({
  selector: 'app-failed-request-log-list',
  templateUrl: './failed-request-log-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FailedRequestLogListComponent {
  AppRequestDescriberMap = AppRequestDescriberMap;
  
  @Input() requests: CompletedCommand[];
  @Input() state: Immutable<StateMissions>
  
  constructor() { }

  trackByReq = (index:number, cmd: CompletedCommand) => 
    (<AppOptimisticHttpRequest> cmd.request).headers[CommandIdHeader];
  
}
