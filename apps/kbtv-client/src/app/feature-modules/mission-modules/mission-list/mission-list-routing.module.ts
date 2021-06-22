import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreloadRouteData } from '@core/services/role-preload.service';
import { CustomRoute } from '@shared-app/interfaces/custom-route.interface';
import { SelectedMissionIdParam } from '@shared-mission/params';
import { MainSkeletonRouteData } from '@shared/components/main-skeleton/main-skeleton-route-data.interface';
import { AuthRouteData } from 'state-auth';
import { MissionListComponent } from './mission-list/mission-list.component';

interface MissionListRoute extends CustomRoute<AuthRouteData & MainSkeletonRouteData & PreloadRouteData>{}

const routes: MissionListRoute[] = [
  {
    path: '',
    component: MissionListComponent,
    children: [
      {
        path: `:${SelectedMissionIdParam}/detaljer`,
        data: {viewSize: "60%", viewType: "card"},
        loadChildren: () => import('src/app/feature-modules/mission-modules/mission-details/mission-details.module').then(m => m.MissionDetailsModule),
      },
      {
        path: 'kart',
        data: {preload: false, disableMaxWidth: true, viewType: "overlay"},
        loadChildren: () => import('src/app/feature-modules/mission-modules/mission-map/mission-map.module').then(m => m.MissionMapModule),
      },
    ]
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionListRoutingModule { }
