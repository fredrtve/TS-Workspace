import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrl } from 'src/app/core/api-url.enum';
import { FilterStore } from 'src/app/core/filter/interfaces/filter-store.interface';
import { FilteredResponse } from 'src/app/core/filter/interfaces/filtered-response.interface';
import { SaveModelWithFileStateCommand } from 'src/app/core/model/interfaces';
import { GetWithRelationsConfig } from 'src/app/core/model/state-helpers/get-with-relations.config';
import { GetWithRelationsHelper } from 'src/app/core/model/state-helpers/get-with-relations.helper';
import { Mission } from "src/app/core/models";
import { ApiService } from 'src/app/core/services/api.service';
import { SaveModelFileToStateHttpConverter } from 'src/app/core/services/model/converters/save-model-file-to-state-http.converter';
import { NotificationService } from 'src/app/core/services/notification';
import { NotificationType } from 'src/app/core/services/notification/notification-type.enum';
import { StateHttpCommandHandler } from 'src/app/core/services/state/state-http-command.handler';
import { ArrayHelperService } from 'src/app/core/services/utility/array-helper.service';
import { StateAction } from 'src/app/core/state';
import { BaseModelStore } from 'src/app/core/state/abstracts/base-model.store';
import { ImageFileExtensions } from 'src/app/shared/constants/image-file-extensions.const';
import { validateFileExtension } from 'src/app/shared/helpers';
import { MissionCriteria } from 'src/app/shared/interfaces';
import { MissionFilter } from 'src/app/shared/mission-filter.model';
import { StoreState } from './interfaces/store-state';
import { MissionFilterViewConfig } from './mission-filter-view/mission-filter-view-config.interface';

@Injectable({
  providedIn: 'any',
})
export class MissionListStore extends BaseModelStore<StoreState> implements FilterStore<MissionCriteria, MissionFilterViewConfig> {

  filterConfig$: Observable<MissionFilterViewConfig> = 
    this.stateSlice$(["missionCriteria","missionTypes", "employers", "missions"]).pipe(map(state => {
      return {
        criteria: state.missionCriteria,
        state: {
          missionTypes: state.missionTypes, 
          employers: state.employers,
          missions: state.missions
        }
      }
    }));

  filteredMissions$: Observable<FilteredResponse<MissionCriteria, Mission>> = 
    this.stateSlice$(["missions", "missionCriteria"]).pipe(
        map(state => {
        const filter = new MissionFilter(state.missionCriteria, null, true);
        return {
            criteria: state.missionCriteria,
            activeCriteriaCount: filter.activeCriteriaCount,
            records: this.arrayHelperService.filter(state.missions, (entity) => filter.check(entity)),
        }})
      );

  get criteria(): MissionCriteria {
    return this.getStateProperty("missionCriteria");
  }

  constructor(
    apiService: ApiService,
    arrayHelperService: ArrayHelperService, 
    private notificationService: NotificationService,
    private stateHttpCommandHandler: StateHttpCommandHandler,
    private saveWithFileStateHttpConverter: SaveModelFileToStateHttpConverter<StoreState, SaveModelWithFileStateCommand<Mission>>,
    private getWithRelationsHelper: GetWithRelationsHelper,
  ) {
    super(arrayHelperService, apiService);
    this.initState();
  }

  getWithRelations$(id: string, trackHistory: boolean = true):Observable<Mission>{
    if(trackHistory) this.updateLastVisited(id);
    let relationCfg = new GetWithRelationsConfig("missions", {includeAll: true});
    return this.stateSlice$(relationCfg.includedProps as any).pipe(
      map(state => this.getWithRelationsHelper.get(state as any, relationCfg, id))
    )
  }

  addFilterCriteria = (missionCriteria: MissionCriteria): void => 
    this._setStateVoid({ missionCriteria });
    
  addsd = (): void => 
    this._setStateVoid({ missionTypes: [...this.getStateProperty<any[]>("missionTypes", true), {id:"test", name: "test"}] });

  updateHeaderImage(id: string, file: File): void {
    if(!validateFileExtension(file, ImageFileExtensions)) 
      return this.notificationService.notify(
          {title: "Filtypen er ikke tillatt.", type: NotificationType.Error}
      );  
    
    this.stateHttpCommandHandler.dispatch(
      this.saveWithFileStateHttpConverter.convert(
        {stateProp: "missions", entity: {id}, file, saveAction: StateAction.Update},
        `${ApiUrl.Mission}/${id}/UpdateHeaderImage`
      )
    )
  }

  private updateLastVisited(id: string){
    let missions = this.getStateProperty<Mission[]>("missions", false);
    if(!missions) return;
    let index = missions.findIndex(x => x.id == id);
    if(!missions[index]) return;
    const mission = {...missions[index]};
    mission.lastVisited = new Date().toISOString(); 
    missions[index] = mission;
    this._setStateVoid({missions})
  }

  private initState(): void {
    this._setStateVoid({
      missionCriteria: {finished: false,employerId: undefined,missionTypeId: undefined,searchString: undefined},
    });
  }

}
