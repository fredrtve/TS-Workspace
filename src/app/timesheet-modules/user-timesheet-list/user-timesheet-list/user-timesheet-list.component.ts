import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FilterConfig } from 'src/app/core/filter/interfaces/filter-config.interface';
import { Timesheet } from "src/app/core/models";
import { FilterSheetService } from 'src/app/core/services/filter';
import { TopDefaultNavConfig } from 'src/app/layout/main-nav-config.interface';
import { MainNavService } from 'src/app/layout/main-nav.service';
import { DateRangePresets } from 'src/app/shared-app/enums';
import { TimesheetFilterViewConfig } from 'src/app/shared-timesheet/components/timesheet-filter-view/timesheet-filter-view-config.interface';
import { TimesheetFilterViewComponent } from 'src/app/shared-timesheet/components/timesheet-filter-view/timesheet-filter-view.component';
import { TimesheetCriteria } from 'src/app/shared-timesheet/interfaces';
import { TimesheetForm } from '../../user-timesheet-form/user-timesheet-form-view/timesheet-form.interface';
import { UserTimesheetListStore } from '../user-timesheet-list.store';

@Component({
  selector: "app-user-timesheet-list",
  templateUrl: "./user-timesheet-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTimesheetListComponent implements OnInit {

  timesheets$: Observable<Timesheet[]> = 
    this.store.filteredTimesheets$.pipe(tap(x => this.configureMainNav(this.store.criteria)));

  constructor(
    private mainNavService: MainNavService,
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterSheetService,
    private store: UserTimesheetListStore
  ) {}

  ngOnInit() { 
    let initFilter = this.route.snapshot.params.initialFilter;
    const criteria: TimesheetCriteria = initFilter ? JSON.parse(initFilter) : {};
    if(criteria.dateRange && !criteria.dateRangePreset) 
      criteria.dateRangePreset = DateRangePresets.Custom
    this.store.addFilterCriteria(criteria);
    this.configureMainNav(criteria);
  }

  openTimesheetForm = (entityId?: string, lockedValues?: TimesheetForm) => 
    this.router.navigate(['skjema', {config: JSON.stringify({formConfig: {entityId, viewConfig: {lockedValues}}})}], {relativeTo: this.route});

  openFilterSheet = (): void => {
    this.filterService.open<TimesheetCriteria, FilterConfig<TimesheetFilterViewConfig>>(
      {formConfig:{  
        filterConfig: {
            disabledFilters: ['userName'], 
        },
        viewComponent: TimesheetFilterViewComponent
    }});
  }
  
  trackByTimesheet = (index: number, timesheet: Timesheet) => timesheet.id

  private onBack = () => {
    let returnUrl: string = this.route.snapshot.params.returnUrl;
    if(returnUrl) this.router.navigateByUrl(returnUrl);
    else this.router.navigate(["/hjem"]);
  }

  private configureMainNav = (criteria: TimesheetCriteria) => {
    let cfg = {
      title:  "Timeliste",
      backFn: this.onBack,
      buttons: [{icon: 'filter_list', colorClass:'color-accent', callback: this.openFilterSheet}]
    } as TopDefaultNavConfig;
    
    let fabs = [
      {icon: "add", aria: 'Legg til', colorClass: 'bg-accent', 
      callback: this.openTimesheetForm, 
      params: [null, {mission: criteria?.mission}]}
    ];

    this.mainNavService.addConfig({default: cfg}, fabs);
  }

}
