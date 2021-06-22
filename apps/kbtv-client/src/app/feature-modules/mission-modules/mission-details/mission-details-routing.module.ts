import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { PreloadRouteData } from '@core/services/role-preload.service';
import { CustomRoute } from '@shared-app/interfaces/custom-route.interface';
import { MainSkeletonRouteData } from '@shared/components/main-skeleton/main-skeleton-route-data.interface';
import { AuthRouteData } from 'state-auth';
import { MissionDetailsComponent } from './mission-details/mission-details.component';

interface MissionListRoute extends CustomRoute<AuthRouteData & MainSkeletonRouteData & PreloadRouteData>{}

const routes: MissionListRoute[] = [
    {
        path: ``,
        component: MissionDetailsComponent,
        children: [
          {
            path: 'timer',
            data: {allowedRoles: RolePermissions.UserTimesheetList.access, viewType: "overlay", preload: false},
            loadChildren: () => import('src/app/feature-modules/timesheet-modules/user-timesheet-list/user-timesheet-list.module').then(m => m.UserTimesheetListModule),
          },
          {
            path: 'bilder',
            data: {viewType: "overlay"},
            loadChildren: () => import('./mission-image-list/mission-image-list.module').then(m => m.MissionImageListModule),
          },
          {
            path: 'dokumenter',
            data: {allowedRoles: RolePermissions.MissionDocumentList.access, viewType: "overlay", preload: false},
            loadChildren: () => import('./mission-document-list/mission-document-list.module').then(m => m.MissionDocumentListModule),
        
          },
          {
            path: 'notater',
            data: {allowedRoles: RolePermissions.MissionNoteList.access, viewType: "overlay", preload: false},
            loadChildren: () => import('./mission-note-list/mission-note-list.module').then(m => m.MissionNoteListModule),
          },
        ]
    },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionDetailsRoutingModule { }