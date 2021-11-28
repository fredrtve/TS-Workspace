import {
  HttpErrorResponse, HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandIdHeader } from '../configurations/command-id-header.const';
import { AppNotificationService } from '@core/services/app-notification.service';
import { AppNotifications } from '@shared-app/constants/app-notifications.const';
import { _httpErrorResponseFormatter } from '@shared-app/helpers/http-error-response-formatter.helper';
import { Maybe } from '@fretve/global-types';
import { AppNotification } from 'notification';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: AppNotificationService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.responseType != "json" || request.url.indexOf('/refresh') !== -1 || request.headers.get(CommandIdHeader)) 
      return next.handle(request);
      
    return next.handle(request).pipe(tap(() => {},
      (err: unknown) => { 
        if (err instanceof HttpErrorResponse) 
          this.notificationService.notify(this.getNotification(request, err));    
      }));
  }

  private getNotification(request: HttpRequest<unknown>, err: HttpErrorResponse): AppNotification{
    if(request.url.indexOf('/SyncAll') !== -1) 
      return AppNotifications.warning({title: 'Synkronisering mislyktes.'})

    return AppNotifications.error({
      ..._httpErrorResponseFormatter(err), 
      duration: this.calculateDuration(err.error?.errors) 
    });
  }

  private calculateDuration(errors: Maybe<{ [key: string]: string[] }>): number{
    const minValue = 5000;
    const value = Object.keys(errors || {}).length * 2500;
    return minValue > value ? minValue : value;
  }
}
