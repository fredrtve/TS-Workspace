import { Injectable } from "@angular/core";
import { Mission } from "@core/models";
import { StateEmployers, StateMissions, StateMissionTypes } from "@core/state/global-state.interfaces";
import { AppChip } from "@shared-app/interfaces/app-chip.interface";
import { MissionCriteria } from "@shared/interfaces";
import { MissionFilter } from "@shared/mission-filter.model";
import { _filter, _sortByDate } from "array-helpers";
import { FormService } from "form-sheet";
import { Immutable } from "global-types";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "state-management";
import { StateSyncConfig } from "state-sync";
import { MissionCriteriaForm, MissionCriteriaFormSheet, MissionCriteriaFormState } from "./forms/mission-criteria-form.const";
import { StateMissionCriteria } from "./interfaces";
import { _missionCriteriaChipsFactory } from "./mission-criteria-chips-factory.helper";
import { SetMissionCriteriaAction } from "./state/actions.const";

export interface FilteredMissionsResponse {
    criteriaChips: AppChip[],
    criteria: Immutable<MissionCriteria>,
    missions: Immutable<Mission[]>
}

export interface MissionFilterFacadeStoreState extends
    StateMissions, StateEmployers, StateMissionTypes, StateSyncConfig, StateMissionCriteria {} 

type StoreState = MissionFilterFacadeStoreState;

@Injectable({providedIn: "any"})
export class MissionFilterFacade {

    private partialResponse$ = this.store.selectProperty$("missionCriteria").pipe(map(criteria => { return {
        criteria,
        criteriaChips: _missionCriteriaChipsFactory(criteria, (x) => this.addCriteria(x))
    }}));
    
    filtered$: Observable<FilteredMissionsResponse> = combineLatest([
        this.partialResponse$,
        this.store.selectProperty$("missions").pipe(
          map(missions => _sortByDate<Mission>(missions, "createdAt", "desc"))
        )
      ]).pipe(
        map(([vm, missions]) => { 
          const filter = new MissionFilter(vm.criteria, undefined, true)
          return { ...vm, missions: _filter<Mission>(missions, (entity) => filter.check(entity)) } 
        })
      );

    get criteria() {
      return this.store.state.missionCriteria;
    }

    constructor(
      private store: Store<StoreState>,
      private formService: FormService,
    ) {}

    openFilterForm = () => 
      this.formService.open<MissionCriteriaForm, MissionCriteriaFormState>(
        MissionCriteriaFormSheet, 
        { 
          initialValue: this.store.state.missionCriteria, 
          formState: this.store.select$(["missionTypes", "employers", "missions", "syncConfig"]) 
        },
        (val) => this.addCriteria(val)
      ); 

    addCriteria = (missionCriteria: Immutable<MissionCriteria>): void => 
      this.store.dispatch(<SetMissionCriteriaAction>{ type: SetMissionCriteriaAction, missionCriteria });

}
