import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { RolePermissions } from "@core/configurations/role-permissions.const";
import { ModelState } from "@core/state/model-state.interface";
import { AppButton } from "@shared-app/interfaces/app-button.interface";
import { WithUnsubscribe } from "@shared-app/mixins/with-unsubscribe.mixin";
import { SearchBarConfig } from "@shared-mission/components/search-bar/search-bar-config.interface";
import { CreateMissionModelForm } from "@shared-mission/forms/save-mission-model-form.const";
import { FilteredMissionsResponse, MissionFilterFacade } from "@shared-mission/mission-filter.facade";
import { BottomBarIconButton } from "@shared/components/bottom-action-bar/bottom-bar-icon-button.interface";
import { MainTopNavConfig } from "@shared/components/main-top-nav-bar/main-top-nav.config";
import { BottomIconButtons } from "@shared/constants/bottom-icon-buttons.const";
import { ModelFormService } from 'model/form';
import { Observable } from "rxjs";

@Component({
  selector: "app-mission-list",
  templateUrl: "./mission-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionListComponent extends WithUnsubscribe(){

  filteredMissions$: Observable<FilteredMissionsResponse> = this.facade.filtered$;

  actionFab: AppButton;
  
  searchBar: SearchBarConfig; 

  searchBarBtns: AppButton[];

  bottomActions: BottomBarIconButton[];

  searchBarHidden: boolean = true;

  navConfig: MainTopNavConfig = { buttons: [
    { icon: "travel_explore", aria: "Åpne kart", callback: () => this.router.navigate(['oppdrag', 'kart']) }
  ]};

  constructor(
    private modelFormService: ModelFormService<ModelState>,
    private facade: MissionFilterFacade,
    private router: Router
  ) {
    super();

    this.bottomActions = [
      {...BottomIconButtons.Filter, callback: () => this.facade.openFilterForm() },
      {...BottomIconButtons.Search, callback: this.toggleSearchBar }
    ]

    this.actionFab = {
      icon: "add", aria: "Legg til", color: "accent",
      callback: () => this.modelFormService.open(CreateMissionModelForm),
      allowedRoles: RolePermissions.MissionList.create
    };

    this.searchBar = {
      searchCallback: this.searchMissions,
      initialValue: this.facade.criteria?.searchString,
      placeholder: "Søk med adresse eller id",
    };

    this.searchBarBtns = [{aria: "Lukk", icon: "close", callback: this.toggleSearchBar}]
  }

  searchMissions = (searchString: string) => 
    this.facade.addCriteria({ ...this.facade.criteria, searchString });

  toggleSearchBar = () => this.searchBarHidden = !this.searchBarHidden;

}
