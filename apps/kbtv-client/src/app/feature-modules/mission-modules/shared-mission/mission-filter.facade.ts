import { Injectable } from "@angular/core";
import { Mission } from "@core/models";
import { StateEmployers, StateMissions } from "@core/state/global-state.interfaces";
import { ModelState } from "@core/state/model-state.interface";
import { AppChip } from "@shared-app/interfaces/app-chip.interface";
import { MissionCriteria } from "@shared/interfaces";
import { MissionFilter } from "@shared/mission-filter.model";
import { _filter, _sortByDate } from "@fretve/array-helpers";
import { FormService } from "form-sheet";
import { Immutable } from "@fretve/global-types";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "state-management";
import { StateSyncConfig } from "state-sync";
import { MissionCriteriaForm, MissionCriteriaFormSheet, MissionCriteriaFormState } from "./forms/mission-criteria-form.const";
import { StateMissionCriteria } from "./interfaces";
import { _missionCriteriaChipsFactory } from "./mission-criteria-chips-factory.helper";
import { SharedMissionActions } from "./state/actions.const";


export interface FilteredMissionsResponse {
    criteriaChips: AppChip[],
    criteria: Immutable<MissionCriteria>,
    missions: Immutable<Mission[]>
}

export interface MissionFilterFacadeStoreState extends
    StateMissions, StateEmployers, StateSyncConfig, StateMissionCriteria {} 

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
      private store: Store<StoreState & ModelState>,
      private formService: FormService,
    ) {}

    openFilterForm = () => 
      {
        return this.formService.open<MissionCriteriaForm, MissionCriteriaFormState>(
          MissionCriteriaFormSheet,
          {
            initialValue: <any>this.store.state.missionCriteria,
            formState: this.store.select$(["employers", "missions", "syncConfig"])
          },
          (val) => this.addCriteria({
            ...val,
            searchString: (typeof val.searchString === "string") ? val.searchString : val.searchString?.address
          })
        );
      }; 

    addCriteria = (missionCriteria: Immutable<MissionCriteria>): void => 
      this.store.dispatch(SharedMissionActions.setMissionCriteria({ missionCriteria }));

}
