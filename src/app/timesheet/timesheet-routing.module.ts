import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetWeekViewComponent } from './timesheet-week-view/timesheet-week-view.component';
import { AuthGuard } from '../core/services';
import { Roles } from '../shared/enums';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { TimesheetWeekListComponent } from './timesheet-week-list/timesheet-week-list.component';


const routes: Routes = [
  {path: '', redirectTo: 'ukevisning', pathMatch: 'full'},
  {
    path: 'ukevisning',
    component: TimesheetWeekViewComponent,
    canActivate: [AuthGuard],
    data: {allowedRoles: [Roles.Leder, Roles.Mellomleder, Roles.Ansatt], animation: 'TimesheetWeekView'},
    children: [
      {path: 'skjema', loadChildren: () => import('src/app/timesheet-user-modules/timesheet-form/timesheet-form.module').then(m => m.TimesheetFormModule)},
    ],
  },
  {
    path: 'ukeliste',
    component: TimesheetWeekListComponent,
    canActivate: [AuthGuard],
    data: {allowedRoles: [Roles.Leder, Roles.Mellomleder, Roles.Ansatt], animation: 'TimesheetWeekList'},
  },
  {
    path: 'liste',
    component: TimesheetListComponent,
    canActivate: [AuthGuard],
    data: {allowedRoles: [Roles.Leder, Roles.Mellomleder, Roles.Ansatt], animation: 'TimesheetList'},
    children: [
      {path: 'skjema', loadChildren: () => import('src/app/timesheet-user-modules/timesheet-form/timesheet-form.module').then(m => m.TimesheetFormModule)},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TimesheetRoutingModule { }
