import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { Mission } from '@core/models';
import { Roles } from '@core/roles.enum';

@Component({
  selector: 'app-mission-details-view',
  templateUrl: './mission-details-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDetailsViewComponent {

  permissions = RolePermissions;
  roles = Roles;

  @Input() mission: Mission;

  constructor() { }
  
}