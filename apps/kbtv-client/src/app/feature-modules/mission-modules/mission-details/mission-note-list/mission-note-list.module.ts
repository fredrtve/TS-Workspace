import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMissionModule } from '@shared-mission/shared-mission.module';
import { ModelStateCommandsModule } from 'model/state-commands';
import { AppRoute } from 'src/app/app-routing.module';
import { StateManagementModule } from 'state-management';
import { MissionNoteListComponent } from './mission-note-list/mission-note-list.component';
import { NoteItemComponent } from './mission-note-list/note-item/note-item.component';

const Routes: AppRoute[] = [{ path: '', component: MissionNoteListComponent }];

@NgModule({
  declarations: [
    MissionNoteListComponent,
    NoteItemComponent,
  ],
  imports: [
    RouterModule.forChild(Routes),
    SharedMissionModule,
    StateManagementModule.forFeature({}), 
    ModelStateCommandsModule 
  ],
})
export class MissionNoteListModule { }
