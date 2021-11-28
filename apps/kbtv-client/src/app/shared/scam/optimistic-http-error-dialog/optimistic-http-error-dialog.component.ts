import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StateMissions } from '@core/state/global-state.interfaces';
import { AppRequestDescriberMap } from '@shared-app/constants/app-request-describer-map.const';
import { FormattedHttpError, _httpErrorResponseFormatter } from '@shared-app/helpers/http-error-response-formatter.helper';
import { SharedAppModule } from '@shared-app/shared-app.module';
import { Immutable } from '@fretve/global-types';
import { CompletedCommand, OptimisticHttpErrorPayload, OptimisticHttpRequest } from 'optimistic-http';
import { Store } from 'state-management';
import { FailedCommandListComponent } from './failed-command-list/failed-command-list.component';

@Component({
  selector: 'app-optimistic-http-error-dialog',
  templateUrl: './optimistic-http-error-dialog.component.html',
  styleUrls: ['./optimistic-http-error-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimisticHttpErrorDialogComponent {
  AppRequestDescriberMap = AppRequestDescriberMap;
  
  httpError: FormattedHttpError;
  errorRequest: Immutable<OptimisticHttpRequest>;
  canceledCommands: Immutable<CompletedCommand[]>;
  state: Immutable<StateMissions>;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) data: OptimisticHttpErrorPayload,
    private store: Store<StateMissions>
  ) { 
        this.state = { missions: this.store.state.missions }
        this.httpError = _httpErrorResponseFormatter(data.httpError);
        this.errorRequest = data.errorCommand.request;
        this.canceledCommands = data.canceledCommands;
    }
  
}

@NgModule({
  declarations: [
    OptimisticHttpErrorDialogComponent,
    FailedCommandListComponent
  ],
  imports:[
    SharedAppModule,
    MatDialogModule,  
  ]
})
class OptimisticHttpErrorDialogModule {}