import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DeviceInfoService } from '@core/services/device-info.service';
import { CustomRoute } from '@shared-app/interfaces/custom-route.interface';
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
    if(!deviceInfoService.isXs) 
      import('./routes/desktop.routes').then(x => {
        router.resetConfig(x.DesktopRoutes);
        router.navigateByUrl(router.url)
      })
  }
}
