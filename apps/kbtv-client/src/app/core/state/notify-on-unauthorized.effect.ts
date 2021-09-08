import { Injectable } from '@angular/core';
import { AppNotificationService } from '@core/services/app-notification.service';
import { AppNotifications } from '@shared-app/constants/app-notifications.const';
import { map } from 'rxjs/operators';
import { AuthActions } from 'state-auth';
import { DispatchedActions, Effect, listenTo } from 'state-management';

@Injectable()
export class NotifyOnUnauthorizedEffect implements Effect{

    constructor(private notificationService: AppNotificationService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([AuthActions.unauthorized]),
            map(x => {
                this.notificationService.notify(AppNotifications.error({
                    title: 'Du mangler riktig autorisasjon for å gå inn på denne siden.'
                }))
            }),
        ) 
    }
}