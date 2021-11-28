import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Maybe } from '@fretve/global-types';
import { AppNotification } from './app-notification.interface';
import { NotificationType } from './notification-type.enum';
import { NotificationComponent } from './notification.component';

/** Responsible for queueing and displaying notifications provided by user as a snack bar */
@Injectable({ providedIn: 'any' })
export class NotificationService {

  private queue: AppNotification[] = [];

  private currentNotification: Maybe<AppNotification>;

  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  /** Displays the provided notification when the snack bar is available
   * @param notification - */
  notify = (notification: AppNotification) => { 
    if(!this.currentNotification && this.currentNotification !== null)
      this.zone.run(x => this.setNotification(notification));      
    else if(JSON.stringify(notification) !== JSON.stringify(this.currentNotification))     
      this.queue.push(notification);    
  }

  private setNotification = (input: Maybe<AppNotification>): void => {
    this.currentNotification = input;
    if(!input) return;

    switch(input?.type){
      case NotificationType.Success:
        this.openSnackBar({...input, icon: 'check_circle', duration: input.duration || 2000});
        break;
      case NotificationType.Error:
        this.openSnackBar({...input, icon: 'error', duration: input.duration || 5000});
        break;
      case NotificationType.Warning:
        this.openSnackBar({...input, icon: 'warning', duration: input.duration || 3500 });
        break;
    }
  }

  private openSnackBar(cfg: Omit<AppNotification, "type"> & {icon: string}){
    let ref = this.snackBar.openFromComponent(NotificationComponent, {
      data : { title: cfg.title, details: cfg.details, icon: cfg.icon },
      duration: cfg.duration || undefined,
      panelClass: cfg.panelClass
    });

    ref.afterDismissed().subscribe(x => this.setNotification(this.queue.shift()))
  }

}
 