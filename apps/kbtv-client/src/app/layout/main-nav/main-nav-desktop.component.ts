import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CssLoaderService } from '@core/services/css-loader.service';
import { LazyStyles } from '@shared-app/enums/lazy-styles.enum';
import { SharedAppModule } from '@shared-app/shared-app.module';
import { MainNavService } from '../main-nav.service';
import { SharedLayoutModule } from './shared-layout.module';

@Component({
  selector: 'app-main-nav-desktop',
  template: `
    <mat-sidenav-container class="h-100">

        <mat-sidenav fixedInViewport class="mat-elevation-z1" 
            role="navigation" mode="side" opened="true" data-cy="side-bar">
    
        <app-main-side-nav-header [config]="config$ | async"></app-main-side-nav-header>
    
        <mat-divider></mat-divider>
        
        <app-main-side-nav-list></app-main-side-nav-list>
        
        </mat-sidenav>
    
        <mat-sidenav-content>
    
            <div>   
                <router-outlet #outlet="outlet"></router-outlet>    
            </div>
    
        </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['./main-side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavDesktopComponent  { 

    config$ = this.mainNavService.sideNavHeaderConfig$;

    constructor(
        private mainNavService: MainNavService,
        cssLoaderService: CssLoaderService
    ){ 
        cssLoaderService.load(LazyStyles.MatSidenav)
    }

}
@NgModule({
    declarations: [
        MainNavDesktopComponent,
    ],
    imports: [
      SharedAppModule,
      SharedLayoutModule
    ],
    exports: [ ]
})
export class MainNavDesktopModule { }