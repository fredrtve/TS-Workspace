import { Injectable } from '@angular/core';
import { AppDialogService } from '@core/services/app-dialog.service';
import { Immutable } from 'global-types';
import { OptimisticActions, OptimisticHttpErrorPayload } from 'optimistic-http';
import { forkJoin, from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';

@Injectable()
export class OpenDialogOnOptimisticError implements Effect {

    constructor(private dialogService: AppDialogService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([OptimisticActions.optimisticHttpError]),
            mergeMap(x => this.openDialog$(x.action)),
        ) 
    }

    private openDialog$(data: Immutable<OptimisticHttpErrorPayload>): Observable<void> {
        return forkJoin([
            from(import('@shared/scam/optimistic-http-error-dialog/optimistic-http-error-dialog.component')),
            this.dialogService.dialog$                 
        ]).pipe(
            map(([{OptimisticHttpErrorDialogComponent}, dialog]) => {
                dialog.open(
                    OptimisticHttpErrorDialogComponent, 
                    { data, panelClass: 'extended-dialog' }
                )
            })
        )
    }

}