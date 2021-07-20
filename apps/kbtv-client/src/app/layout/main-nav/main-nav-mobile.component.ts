import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, NgModule, ViewContainerRef } from '@angular/core';
import { CssLoaderService } from '@core/services/css-loader.service';
import { LazyStyles } from '@shared-app/enums/lazy-styles.enum';
import { SharedAppModule } from '@shared-app/shared-app.module';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import { MainNavService } from '../main-nav.service';

@Component({
  selector: 'app-main-nav-mobile',
  template:`
    <style>
        .outlet-container{
            overflow-x:hidden;
            position:relative;
            height:100%;
            flex-direction: row;
            flex: 1 1 1e-09px;
        }
    </style>
    <div class="outlet-container">
        <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavMobileComponent {

    constructor(
        mainNavService: MainNavService,
        private cssLoaderService: CssLoaderService,
        private cfr: ComponentFactoryResolver,
        private cdRef: ChangeDetectorRef,
        private vcRef: ViewContainerRef
    ){
        mainNavService.toggleDrawer$.pipe(first()).subscribe(x => this.loadSideNav())
    }
    
    private loadSideNav(): void {
        this.cssLoaderService.load(LazyStyles.MatSidenav);
        from(import('./main-side-nav-mobile.component')).subscribe(({MainSideNavMobileComponent}) => {
            const fac = this.cfr.resolveComponentFactory(MainSideNavMobileComponent);
            this.vcRef.createComponent(fac)
            this.cdRef.markForCheck();
        })  
    }
}
@NgModule({
    declarations: [MainNavMobileComponent],
    imports: [SharedAppModule],
    exports: []
})
export class MainNavMobileModule { }