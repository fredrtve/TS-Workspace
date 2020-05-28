import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/services';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MissionDetailsComponent } from './mission-details/mission-details.component';
import { MissionImageListComponent } from './mission-image-list/mission-image-list.component';
import { MissionReportListComponent } from './mission-report-list/mission-report-list.component';


const routes: Routes = [
{
  path: '',
  component: MissionListComponent,
  canActivate: [AuthGuard],data: {animation: 'MissionList'}
},
{
  path: ':id/detaljer',
  component: MissionDetailsComponent,
  canActivate: [AuthGuard],data: {animation: 'MissionDetails'}
},
{
  path: ':id/bilder',
  component: MissionImageListComponent,
  canActivate: [AuthGuard],data: {animation: 'MissionImages'}
},
{
  path: ':id/rapporter',
  component: MissionReportListComponent,
  canActivate: [AuthGuard],data: {animation: 'MissionReports'}
},
{
  path: ':id/notater',
  component: MissionImageListComponent,
  canActivate: [AuthGuard],data: {animation: 'MissionNotes'}
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionRoutingModule { }
