import { NgModule } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { DeviceInfoService } from '@core/services/device-info.service';
import { CustomRoute } from '@shared-app/interfaces/custom-route.interface';
import { combineLatest, from } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { PreloadRouteData } from './core/services/role-preload.service';
import { MobileRoutes } from './routes/mobile.routes';

export interface AppRoute extends CustomRoute<PreloadRouteData>{}

@NgModule({
  imports: [RouterModule.forRoot(MobileRoutes,  {
    // preloadingStrategy: RolePreloadService,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(
    deviceInfoService: DeviceInfoService,
    router: Router,
  ){  
    if(!deviceInfoService.isXs) {
      combineLatest([
        from(import('./routes/desktop.routes')),
        router.events.pipe(filter(e => e instanceof NavigationStart), first())
      ]).subscribe(([routes, routerEvent]) => {
        router.resetConfig(routes.DesktopRoutes);
        router.navigateByUrl((<NavigationStart> routerEvent).url)
      })
    }
  }
}
