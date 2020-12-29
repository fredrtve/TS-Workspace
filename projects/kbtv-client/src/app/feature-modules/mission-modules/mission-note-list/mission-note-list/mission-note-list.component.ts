import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionNote } from '@core/models';
import { ModelFormService } from '@model-form/model-form.service';
import { RolePresets } from '@shared-app/enums';
import { _trackByModel } from '@shared-app/helpers/trackby/track-by-model.helper';
import { AppButton } from '@shared-app/interfaces';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { CreateMissionNoteForm, EditMissionNoteForm } from '@shared/constants/model-forms/save-mission-note-forms.const';
import { _sortByDate } from 'array-helpers';
import { Maybe } from 'global-types';
import { map } from 'rxjs/operators';
import { MissionNoteListFacade } from '../mission-note-list.facade';

@Component({
  selector: 'app-mission-note-list',
  templateUrl: './mission-note-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionNoteListComponent {
  
  notes$ = this.facade.getByMissionId$(this.missionId).pipe(
    map(x => _sortByDate<MissionNote>(x, "updatedAt"))
  );

  navConfig: MainTopNavConfig; 
  fabs: AppButton[];
  
  get missionId(): Maybe<string> { return this.route.parent?.parent?.snapshot.params.id }

  constructor( 
    private facade: MissionNoteListFacade,
    private route: ActivatedRoute,
    private router: Router,
    private modelFormService: ModelFormService
    ) {  
    this.navConfig = {title:  "Notater", backFn: this.onBack};
    this.fabs = [
      {icon: "add", aria: 'Legg til', color: "accent", 
      callback: this.openCreateNoteForm, allowedRoles: RolePresets.Internal}
    ]
  }
 
  openEditNoteForm = (entityId: number) => 
    this.modelFormService.open({formConfig: {
      dynamicForm: EditMissionNoteForm,
      stateProp: "missionNotes", entityId
    }});

  trackByNote = _trackByModel("missionNotes")
  
  private openCreateNoteForm = () => 
    this.modelFormService.open({
      formConfig: {
        dynamicForm: {...CreateMissionNoteForm, initialValue: {missionId: <string> this.missionId}},
        stateProp: "missionNotes",
      },
    });

  private onBack = () => this.router.navigate(['../'], {relativeTo: this.route.parent});
}
