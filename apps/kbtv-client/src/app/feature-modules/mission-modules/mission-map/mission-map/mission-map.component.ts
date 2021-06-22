import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { SearchBarConfig } from '@shared-mission/components/search-bar/search-bar-config.interface';
import { FilteredMissionsResponse, MissionFilterFacade } from '@shared-mission/mission-filter.facade';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { BottomIconButtons } from '@shared/constants/bottom-icon-buttons.const';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mission-map',
  templateUrl: './mission-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionMapComponent {

  filteredMissions$: Observable<FilteredMissionsResponse> = this.facade.filtered$;

  actionFab: AppButton;

  searchBar: SearchBarConfig;

  searchBarBtns: AppButton[];

  navConfig: MainTopNavConfig;

  searchBarHidden: boolean = true;

  constructor(
    private facade: MissionFilterFacade,
    private router: Router
  ) {
    this.navConfig = {
      customCancelFn: () => this.router.navigate(['oppdrag']),
      buttons: [
        { ...BottomIconButtons.Filter, callback: this.openMissionFilter },
        { ...BottomIconButtons.Search, callback: this.toggleSearchBar },
      ]
    };

    this.searchBar = {
      searchCallback: this.searchMissions,
      initialValue: this.facade.criteria?.searchString,
      placeholder: 'Søk med adresse eller id',
    };

    this.searchBarBtns = [
      { aria: 'Lukk', icon: 'close', callback: this.toggleSearchBar },
    ];
  }

  private searchMissions = (searchString: string) =>
    this.facade.addCriteria({ ...this.facade.criteria, searchString });

  private toggleSearchBar = () => (this.searchBarHidden = !this.searchBarHidden);

  private openMissionFilter = () => this.facade.openFilterForm()
}
