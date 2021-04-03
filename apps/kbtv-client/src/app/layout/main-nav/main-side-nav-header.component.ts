import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MainSideNavConfig } from '../interfaces/main-side-nav-config.interface';
import { MainNavService } from '../main-nav.service';

@Component({
  selector: 'app-main-side-nav-header',
  template: `
    <style>
        mat-toolbar{
            flex-direction: column;
            box-sizing: border-box;
            display: flex;
            place-content: stretch center;
            align-items: stretch;
            max-width: 100%;
            background: transparent;
        }
    </style>

    <mat-toolbar class="mb-4 mt-4" *ngIf="config$ | asyncDetect; let config">

        <ng-container *ngIf="config.isOnline else offlineHeader">
        <span class="mat-small color-accent ellipsis"> Tilkoblet internett</span>
        </ng-container>
        <ng-template #offlineHeader>
        <span class="mat-small color-warn ellipsis">Frakoblet internett</span>
        </ng-template>
    
        <span class="mat-subheading-1 ellipsis" *ngIf="config.user" style="margin:0;">
        {{ config.user.firstName }} {{ config.user.lastName }}
        </span>
    
        <span class="mat-small ellipsis" *ngIf="config.user">
        Sist synkronisert {{ config.syncTimestamp | date : 'shortTime'}}
        </span>
    
    </mat-toolbar>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainSideNavHeaderComponent {

  config$: Observable<MainSideNavConfig> = this.mainNavService.sideNavHeaderConfig$
  
  constructor(
      private mainNavService: MainNavService, 
      private cdRef: ChangeDetectorRef
    ) { }

    ngAfterViewInit(): void {
      this.cdRef.detach(); 
    }

}
