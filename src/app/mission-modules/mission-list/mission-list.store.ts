import { Injectable } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrl } from 'src/app/core/api-url.enum';
import { FilterStore } from 'src/app/core/filter/interfaces/filter-store.interface';
import { SaveModelWithFileStateCommand } from 'src/app/core/model/interfaces';
import { GetWithRelationsConfig } from 'src/app/core/model/state-helpers/get-with-relations.config';
import { GetWithRelationsHelper } from 'src/app/core/model/state-helpers/get-with-relations.helper';
import { Mission } from "src/app/core/models";
import {
  ApiService,
  ArrayHelperService
} from "src/app/core/services";
import { FilterStateHelper } from 'src/app/core/services/filter';
import { SaveModelFileToStateHttpConverter } from 'src/app/core/services/model/converters/save-model-file-to-state-http.converter';
import { StateAction } from 'src/app/core/state';
import { BaseModelStore } from 'src/app/core/state/abstracts/base-model.store';
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

  filteredMissions$: Observable<{criteria: MissionCriteria; missions: Mission[]}> = 
    this.stateSlice$(["missions", "missionCriteria"]).pipe(
        map(state => {
        return {
            criteria: state.missionCriteria,
            missions: this.filterStateHelper.filter(state.missions, state.missionCriteria, MissionFilter, null, true),
        }})
      );

  get criteria(): MissionCriteria {
    return this.getStateProperty("missionCriteria");
  }

  constructor(
    apiService: ApiService,
    arrayHelperService: ArrayHelperService, 
    private filterStateHelper: FilterStateHelper,
    private saveWithFileStateHttpConverter: SaveModelFileToStateHttpConverter<StoreState, SaveModelWithFileStateCommand<Mission>>,
    private getWithRelationsHelper: GetWithRelationsHelper<StoreState>,
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
    this._stateHttpCommandHandler(
      this.saveWithFileStateHttpConverter.convert(
        {stateProp: "missions", entity: {id}, file, saveAction: StateAction.Update},
        `${ApiUrl.Mission}/${id}/UpdateHeaderImage`
      )
    )
  }

  private updateLastVisited(id: string){
    let missions = this.getStateProperty<Mission[]>("missions");
    if(!missions) return;
    let index = missions.findIndex(x => x.id == id);
    if(!missions[index]) return;
    missions[index].lastVisited = new Date(); 
    this._setStateVoid({missions})
  }

  private initState(): void {
    this._setStateVoid({
      missionCriteria: {finished: false,employerId: undefined,missionTypeId: undefined,searchString: undefined},
    });
  }

}
