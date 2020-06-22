import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UserTimesheetService, DateTimeService, MainNavService } from "src/app/core/services";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { TimesheetStatus, DateRangePresets } from "src/app/shared-app/enums";
import { ActivatedRoute, Router } from "@angular/router";
import { Mission, Timesheet } from "src/app/core/models";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap, filter, tap, distinctUntilChanged } from "rxjs/operators";
import { TopDefaultNavConfig } from 'src/app/shared-app/interfaces';
import { TimesheetListFilter } from 'src/app/shared/timesheet-list-filter.model';
import { TimesheetFilterSheetWrapperComponent } from 'src/app/timesheet-modules/shared-timesheet/components';

@Component({
  selector: "app-timesheet-list",
  templateUrl: "./timesheet-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TimesheetListComponent implements OnInit {
  timesheetStatus = TimesheetStatus;

  private filterSubject: BehaviorSubject<TimesheetListFilter>;

  timesheets$: Observable<Timesheet[]>;

  constructor(
    private mainNavService: MainNavService,
    private route: ActivatedRoute,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private userTimesheetService: UserTimesheetService,
    private dateTimeService: DateTimeService
  ) {this.configureMainNav();}

  ngOnInit() {
    //Initiate filter and observable
    this.filterSubject = new BehaviorSubject(this.getInitialFilter());

    this.timesheets$ = this.filterSubject.asObservable().pipe(distinctUntilChanged(),
      switchMap(filter => this.userTimesheetService.getByWithMission$(x => filter.checkTimesheet(x)))
    );
  }

  openTimesheetForm = (missionPreset?: Mission, idPreset?: number) => 
    this.router.navigate(['skjema'], {relativeTo: this.route, queryParams: {idPreset, missionPreset: JSON.stringify(missionPreset)}});

  deleteTimesheet = (id: number) => this.userTimesheetService.delete$(id).subscribe();

  getCurrentFilter = (): TimesheetListFilter => this.filterSubject.value;

  openFilterSheet = (): void => {
    let ref = this._bottomSheet.open(TimesheetFilterSheetWrapperComponent, {
      data: {filter: this.getFilterCopy(), disabledFilters: ['user']}
    });

    ref.afterDismissed()
      .pipe(filter(f => f instanceof TimesheetListFilter))
      .subscribe(f => this.filterSubject.next(f));
  }
  
  private getFilterCopy() { //Copy filter with functionality
    return Object.assign(
      Object.create(Object.getPrototypeOf(this.filterSubject.value)),
      this.filterSubject.value
    );
  }

  private getInitialFilter(): TimesheetListFilter {
    let filter = new TimesheetListFilter();

    if (this.route.snapshot.params["mission"])
      filter.mission = JSON.parse(this.route.snapshot.params["mission"]);

    if (this.route.snapshot.params["dateRange"]) {
      //Set custom date range if found
      filter.dateRangePreset = DateRangePresets.Custom;
      let dr = JSON.parse(this.route.snapshot.params["dateRange"]);
      dr[0] = new Date(dr[0]);
      dr[1] = new Date(dr[1]);
      filter.dateRange = dr;
    } else if (this.route.snapshot.params["dateRangePreset"]) {
      //Else set preset if found
      filter.dateRangePreset = this.route.snapshot.params["dateRangePreset"];
      filter.dateRange = this.dateTimeService.getRangeByDateRangePreset(
        this.route.snapshot.params["dateRangePreset"]
      );
    } else {
      //Default year preset if no input
      filter.dateRangePreset = DateRangePresets.CurrentYear;
      filter.dateRange = this.dateTimeService.getRangeByDateRangePreset(filter.dateRangePreset);
    }
    return filter;
  }

  private onBack = () => {
    let returnRoute: string = this.route.snapshot.params["returnRoute"];
    if (returnRoute) this.router.navigateByUrl(returnRoute);
    else this.router.navigate([""]);
  }

  private configureMainNav(){
    let cfg = {
      title:  "Timeliste",
      backFn: this.onBack,
      buttons: [{icon: 'filter_list', colorClass:'color-accent', callback: this.openFilterSheet}]
    } as TopDefaultNavConfig;
    
    this.mainNavService.addTopNavConfig({default: cfg});
  }

}
