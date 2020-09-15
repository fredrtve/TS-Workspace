import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Mission } from 'src/app/core/models';
import { MainNavService, TopDetailNavConfig } from 'src/app/layout';
import { RolePresets, Roles } from 'src/app/shared-app/enums';
import { MissionListStore } from '../mission-list.store';
import { TimesheetStatus } from 'src/app/shared-app/enums';
import { appFileUrl } from 'src/app/shared-app/app-file-url.helper';

@Component({
  selector: 'app-mission-details',
  templateUrl: './mission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MissionDetailsComponent{
  @ViewChild('imageInput') imageInput: ElementRef<HTMLElement>;
  RolePresets = RolePresets;
  Roles = Roles;

  mission$: Observable<Mission> = this.store.getWithRelations$(this.missionId).pipe(tap(x => this.configureMainNav(x)));

  get missionId() { return this.route.snapshot.paramMap.get('id') }

  constructor(
    private mainNavService: MainNavService,
    private store: MissionListStore,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog, 
  ){ }

  updateHeaderImage = (files: FileList): void => {
    this.store.updateHeaderImage(this.missionId, files[0]);
  }

  private openHeaderImageInput = (): void => this.imageInput?.nativeElement?.click();
  
  private openMissionForm = (entityId: number) => 
    this.router.navigate(['rediger', {config: JSON.stringify({formConfig:{entityId}, onDeleteUri: "/oppdrag"})}], {relativeTo: this.route});

  private goToTimesheets = (mission: Mission) => 
    this.router.navigate(['mine-timer/liste', {
      returnUrl: this.router.url, 
      initialFilter: JSON.stringify({mission, status: TimesheetStatus.Open})
    }]);

  private configureMainNav(mission: Mission){
    let cfg = {
      title: mission?.address?.split(',').filter(x => x.toLowerCase().replace(/\s/g, '') !== 'norge'),
      subTitle: mission?.finished ? 'Oppdrag ferdig!' : '',
      subIcon: mission?.finished ? 'check' : '',
      imgSrc: mission?.fileName ? appFileUrl(mission.fileName, "missionheader") : null,
      backFn: this.onBack 
    } as TopDetailNavConfig;

    cfg.bottomSheetButtons = [  
      {text: "Registrer timer", icon: "timer", callback: this.goToTimesheets, params:[mission], allowedRoles: RolePresets.Internal},
      {text: "Rediger", icon: "edit", callback: this.openMissionForm, params: [mission?.id], allowedRoles: [Roles.Leder]},
      {text: `${mission?.fileName ? 'Oppdater' : 'Legg til'} forsidebilde`, icon: "add_photo_alternate", callback: this.openHeaderImageInput, allowedRoles: [Roles.Leder]},
    ];
 
    this.mainNavService.addConfig({detail: cfg});
  }

  private onBack = () => this.router.navigate(['/oppdrag'])

}
