import { Injectable } from "@angular/core";
import { FilteredMissionsResponse, MissionFilterFacade } from "@shared-mission/mission-filter.facade";
import { MissionCriteria } from '@shared/interfaces';
import { Immutable } from 'global-types';
import { Observable } from "rxjs";

@Injectable({providedIn: "any"})
export class MissionMapFacade {

  filteredMissions$: Observable<FilteredMissionsResponse> = this.filterFacade.filtered$;

  get criteria() { return this.filterFacade.criteria; }

  constructor(private filterFacade: MissionFilterFacade) {}

  openFilterForm = () => this.filterFacade.openFilterForm();

  addCriteria = (missionCriteria: Immutable<MissionCriteria>): void => 
    this.filterFacade.addCriteria(missionCriteria);

}
