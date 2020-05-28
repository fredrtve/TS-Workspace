import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { EmployerService, NotificationService, MissionTypeService, MissionService } from 'src/app/core/services';
import { Mission, MissionType, Employer } from 'src/app/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionFormComponent {

  @Input() missionIdPreset: number;
  
  @Output() finished = new EventEmitter();

  mission$: Observable<Mission>;
  missionTypes$: Observable<MissionType[]> = this.missionTypeService.getAll$();
  employers$: Observable<Employer[]> = this.employerService.getAll$();

  isCreateForm: boolean = false;

  constructor(
    private employerService: EmployerService,
    private missionTypeService: MissionTypeService,
    private missionService: MissionService,
    private notificationService: NotificationService) {}

  ngOnInit(): void {
    if(!this.missionIdPreset) this.isCreateForm = true;
    else this.mission$ = this.missionService.get$(this.missionIdPreset);
  }

  onSubmit(result: Mission): void{
    if(!result) this.onFinished(null);
    else if(!this.isCreateForm) this.editMission(result);
    else this.createMission(result);
  }

  createMission(mission: Mission): void{
    if(!mission) return null;
    this.missionService.add$(mission).subscribe(res => this.onFinished(res.id));
  }

  editMission(mission: Mission): void{
    if(!mission) return null;
    this.missionService.update$(mission).subscribe(res => {
        this.notificationService.setNotification('Vellykket oppdatering!');
        this.onFinished(res.id);
      })
  }

  private onFinished = (id: number): void => this.finished.emit(id);
  

}