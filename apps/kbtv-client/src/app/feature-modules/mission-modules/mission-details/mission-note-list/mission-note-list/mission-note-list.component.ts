import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { ModelState } from '@core/state/model-state.interface';
import { _trackByModel } from '@shared-app/helpers/trackby/track-by-model.helper';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { CreateMissionNoteModelForm, EditMissionNoteModelForm } from '@shared-mission/forms/save-mission-note-model-form.const';
import { ModelFormService } from 'model/form';
import { MissionDetailsFacade } from '../../mission-details.facade';

@Component({
  selector: 'app-mission-note-list',
  templateUrl: './mission-note-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionNoteListComponent {
  can = RolePermissions.MissionNoteList
  
  notes$ = this.facade.getChildren$("missionNotes");

  actionFab: AppButton;

  constructor( 
    private facade: MissionDetailsFacade,
    private modelFormService: ModelFormService<ModelState>
  ) {  
    this.actionFab = {
      icon: "add", aria: 'Legg til', color: "accent", 
      callback: this.openCreateNoteForm, allowedRoles: RolePermissions.MissionNoteList.create
    }  
  }
 
  openEditNoteForm = (id: string) => 
    this.modelFormService.open(EditMissionNoteModelForm, {id});

  trackByNote = _trackByModel("missionNotes")
  
  private openCreateNoteForm = () => 
    this.modelFormService.open(CreateMissionNoteModelForm, {missionId: <string> this.facade.missionId});

}