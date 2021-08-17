import { ChangeDetectionStrategy, Component, NgModule, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { WithUnsubscribe } from '@shared-app/mixins/with-unsubscribe.mixin';
import { SharedAppModule } from '@shared-app/shared-app.module';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MainSideNavConfig } from '../interfaces/main-side-nav-config.interface';
import { MainNavService } from '../main-nav.service';
import { SharedLayoutModule } from './shared-layout.module';

@Component({
  selector: 'app-main-side-nav-mobile',
  template: `
    <mat-sidenav-container style="height:0">

        <mat-sidenav fixedInViewport #drawer class="mat-elevation-z1" 
            role="dialog" mode="over" opened="false" data-cy="side-bar">
    
        <app-main-side-nav-header [config]="config$ | async"></app-main-side-nav-header>
    
        <mat-divider></mat-divider>
        
        <app-main-side-nav-list></app-main-side-nav-list>
        
        </mat-sidenav>

    </mat-sidenav-container>
  `,
  styleUrls: ['./main-side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MainSideNavMobileComponent extends WithUnsubscribe() {
    @ViewChild('drawer') drawer: MatDrawer;
  
    config$: Observable<MainSideNavConfig> = combineLatest([
        this.mainNavService.sideNavHeaderConfig$,
        this.mainNavService.drawerOpenChanged$
      ]).pipe(
        filter(x => x[1] === true),
        map(x => x[0])
      )

    constructor(private mainNavService: MainNavService) {
      super();
  
      this.mainNavService.toggleDrawer$.pipe(
        takeUntil(this.unsubscribe),
      ).subscribe(x => this.toggleDrawer());
  
    }
  
    ngAfterViewInit(): void {
      this.toggleDrawer();
      this.drawer._container!.backdropClick.pipe( 
        takeUntil(this.unsubscribe),
      ).subscribe(x => this.mainNavService.setDrawerOpenState(false))
    }
  
    toggleDrawer(){ 
      this.mainNavService.setDrawerOpenState(!this.drawer.opened)
      this.drawer?.toggle(); 
    };
}
@NgModule({
    declarations: [
      MainSideNavMobileComponent,
    ],
    imports: [
      SharedAppModule,
      SharedLayoutModule
    ],
    exports: [ ]
  })
  export class MainSideNavMobileModule { }
  