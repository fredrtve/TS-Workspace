import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Mission, Timesheet } from "src/app/core/models";
import { FormService } from 'src/app/core/services/form/form.service';
import { _getModelDisplayValue } from 'src/app/core/services/model/helpers/get-model-property.helper';
import { ModelFormService } from 'src/app/core/services/model/model-form.service';
import { ChipsFactoryService } from 'src/app/core/services/ui/chips-factory.service';
import { DateRangePresets } from 'src/app/shared-app/enums';
import { _formatDateRange } from 'src/app/shared-app/helpers/datetime/format-date-range.helper';
import { _formatShortDate } from 'src/app/shared-app/helpers/datetime/format-short-date.helper';
import { _getSetPropCount } from 'src/app/shared-app/helpers/object/get-set-prop-count.helper';
import { AppButton } from 'src/app/shared-app/interfaces';
import { AppChip } from 'src/app/shared-app/interfaces/app-chip.interface';
import { TimesheetCriteria } from 'src/app/shared-timesheet/interfaces';
import { MainTopNavConfig } from 'src/app/shared/components/main-top-nav-bar/main-top-nav.config';
import { _objectToDisabledObjectMap } from 'src/app/shared/dynamic-form/helpers/disabled-control-map.helper';
import { DynamicForm } from 'src/app/shared/dynamic-form/interfaces';
import { TimesheetStatus } from 'src/app/shared/enums';
import { TimesheetCriteriaForm, TimesheetCriteriaFormState } from 'src/app/shared/forms/timesheet-criteria-form.const';
import { DateRange } from 'src/app/shared/interfaces/date-range.interface';
import { SaveModelFormState } from 'src/app/shared/model-form/interfaces';
import { CreateUserTimesheetForm, EditUserTimesheetForm, TimesheetForm } from 'src/app/shared/model-forms/save-user-timesheet-form.const';
import { translations } from 'src/app/shared/translations';
import { UserTimesheetFormToSaveModelAdapter } from '../save-user-timesheet/user-timesheet-form-to-save-model.adapter';
import { UserTimesheetListStore } from '../user-timesheet-list.store';

interface ViewModel { timesheets: Timesheet[], fabs?: AppButton[], chips?: AppChip[], navConfig?: MainTopNavConfig  }

@Component({
  selector: "app-user-timesheet-list",
  templateUrl: "./user-timesheet-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTimesheetListComponent implements OnInit {

  private navView$: Observable<Partial<ViewModel>> = this.store.criteria$.pipe(
    map(criteria => { return {
      navConfig: this.getTopNavConfig(criteria),
      fabs: [
        {icon: "add", aria: 'Legg til', color: 'accent', 
          callback: this.openTimesheetForm,
          params: [null, {mission: criteria?.mission}]}
      ],
      chips: this.chipsFactory.createCriteriaChips(criteria, 
          (prop) => this.resetCriteriaProp(prop, criteria),
          {
            status: {valueFormatter: (val: TimesheetStatus) => val ? translations[TimesheetStatus[val].toLowerCase()] : null }, 
            mission: {valueFormatter: (val: Mission) => _getModelDisplayValue("missions", val)},
            dateRange: {valueFormatter: (val: DateRange) => _formatDateRange(val, _formatShortDate)}, 
            dateRangePreset: {ignored: true}
          }
        )
    }})
  )

  vm$: Observable<ViewModel> = combineLatest([this.store.filteredTimesheets$, this.navView$]).pipe(
    map(([filtered, vm]) => { return {...vm, timesheets: filtered.records}})
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private store: UserTimesheetListStore,
    private chipsFactory: ChipsFactoryService,
    private modelFormService: ModelFormService
  ) {}

  ngOnInit() { 
    let filter = this.route.snapshot.params.filter;

    const criteria: TimesheetCriteria = filter ? JSON.parse(filter) : {};
    
    if(criteria.dateRange && !criteria.dateRangePreset) 
      criteria.dateRangePreset = DateRangePresets.Custom

    this.store.addFilterCriteria(criteria);
  }

  openTimesheetForm = (entityId?: string, initialValue?: TimesheetForm): void => {
    let dynamicForm: DynamicForm<TimesheetForm, SaveModelFormState>;
    if(!entityId) dynamicForm = {...CreateUserTimesheetForm, disabledControls: _objectToDisabledObjectMap(initialValue)}
    else dynamicForm = EditUserTimesheetForm

    this.modelFormService.open<TimesheetForm, SaveModelFormState>({
      formConfig:{
        dynamicForm: {...dynamicForm, initialValue}, entityId,
        adapter: UserTimesheetFormToSaveModelAdapter, 
        stateProp: "userTimesheets",  
      }
    })
  };

  openTimesheetFilter = (): void => {
    this.formService.open<TimesheetCriteria, TimesheetCriteriaFormState>({
      formConfig: { ...TimesheetCriteriaForm, 
        disabledControls: {user: true},
        initialValue: this.store.criteria}, 
      formState: this.store.timesheetCriteriaFormState$,
      navConfig: {title: "Velg filtre"},
      submitCallback: (val: TimesheetCriteria) => this.store.addFilterCriteria(val)
    });
  }

  private onBack = () => {
    let returnUrl: string = this.route.snapshot.params.returnUrl;
    if(returnUrl) this.router.navigateByUrl(returnUrl);
    else this.router.navigate(["/hjem"]);
  }

  private getTopNavConfig = (criteria: TimesheetCriteria): MainTopNavConfig => {
    let activeCriteriaCount = _getSetPropCount(criteria, {dateRangePreset:null})
    return {
      title:  "Timeliste", 
      backFn: this.onBack,     
      buttons: [{
        icon: 'filter_list', 
        callback: this.openTimesheetFilter,
        color: (activeCriteriaCount && activeCriteriaCount > 0) ? "accent" : null
      }],
    }
  }

  private resetCriteriaProp(prop: string, criteria: TimesheetCriteria){
    criteria[prop] = null;
    this.store.addFilterCriteria(criteria);
  }

  private formatCriteriaChips(criteria: TimesheetCriteria): TimesheetCriteria{
    if(!criteria) return;
    let clone = {...criteria};

    if(clone.status === TimesheetStatus.Open) clone.status = "Åpen" as any;
    else if(clone.status === TimesheetStatus.Confirmed) clone.status = "Låst" as any;
    else clone.status = null;

    return clone;
  }

}
