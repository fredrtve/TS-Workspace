import { Injectable } from "@angular/core";
import { Mission } from "@core/models";
import { FilteredMissionsResponse, MissionFilterFacade } from "@shared-mission/mission-filter.facade";
import { CreateMissionImagesAction } from "@shared-mission/state/actions.const";
import { ModelFileForm, _formToSaveModelFileConverter } from '@shared/constants/form-to-save-model-file.converter';
import { MissionCriteria } from '@shared/interfaces';
import { Immutable, Maybe, Prop } from 'global-types';
import { _getModel } from "model/core";
import { ModelCommand } from 'model/state-commands';
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from 'state-management';
import { UpdateLastVisitedAction } from "./state/actions.const";
import { MissionListStoreState } from "./state/mission-list-store-state.interface";

type StoreState = MissionListStoreState;

@Injectable({providedIn: "any"})
export class MissionListFacade {

  filteredMissions$: Observable<FilteredMissionsResponse> = this.filterFacade.filtered$;

  get criteria() { return this.filterFacade.criteria; }

  constructor(
    private store: Store<StoreState>,
    private filterFacade: MissionFilterFacade
  ) {}

  getMissionDetails$(id: Maybe<string>): Observable<Maybe<Immutable<Mission>>> {
    if(!id) return of(null);
    this.updateLastVisited(id);

    const children: Prop<StoreState>[] = ["missionNotes", "missionDocuments", "missionImages"];

    return this.store.select$(["missions", "employers", ...children]).pipe(
      map(state => _getModel<StoreState, Mission>(state, id, 
        {prop: "missions", children: ["missionNotes", "missionDocuments", "missionImages"], foreigns: ['employer']}))
    )
  }
    
  updateHeaderImage(id: string, file: File): void {
    this.store.dispatch(_formToSaveModelFileConverter({
      formValue: <ModelFileForm> {id, file},
      stateProp: "missions",
      saveAction: ModelCommand.Update
    }));
  }

  addMissionImages = (missionId: string, files: FileList): void =>
   this.store.dispatch(<CreateMissionImagesAction>{type: CreateMissionImagesAction, missionId, files: {...files}});

  openFilterForm = () => this.filterFacade.openFilterForm();

  addCriteria = (missionCriteria: Immutable<MissionCriteria>): void => 
    this.filterFacade.addCriteria(missionCriteria);

  private updateLastVisited = (id: string): void => 
    this.store.dispatch(<UpdateLastVisitedAction>{ type: UpdateLastVisitedAction, id })

}
