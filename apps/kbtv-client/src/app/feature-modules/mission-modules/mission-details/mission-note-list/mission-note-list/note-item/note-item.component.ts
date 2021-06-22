import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { MissionNote } from '@core/models';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent {
  can = RolePermissions.MissionNoteList
  
  @Input() note: MissionNote;

  @Output() editClicked = new EventEmitter();

  constructor() { }

  editNote = () => this.editClicked.emit(this.note.id);
}
