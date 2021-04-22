import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Timesheet } from '@core/models';
import { ChipsFactoryService } from '@core/services/ui/chips-factory.service';
import { _getSetPropCount } from '@shared-app/helpers/object/get-set-prop-count.helper';
import { AppChip } from '@shared-app/interfaces/app-chip.interface';
import { TimesheetSummary } from '@shared-timesheet/interfaces';
import { TimesheetCriteriaChipOptions } from '@shared-timesheet/timesheet-filter/timesheet-criteria-chip-options.const';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { BottomBarIconButton } from '@shared/components/bottom-action-bar/bottom-bar-icon-button.interface';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { BottomIconButtons } from '@shared/constants/bottom-icon-buttons.const';
import { TimesheetCriteriaForm, TimesheetCriteriaFormState } from '@shared/constants/forms/timesheet-criteria-form.const';
import { GroupByPeriod } from '@shared/enums';
import { FormService } from 'form-sheet';
import { Immutable, ImmutableArray, Maybe, Prop } from 'global-types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExportCsvFormService } from '../export-csv-form.service';
import { TimesheetStatisticFacade } from '../timesheet-statistic.facade';
import { TimesheetStatisticTableComponent } from './timesheet-statistic-table/timesheet-statistic-table.component';

interface ViewModel { 
  groupByChips: AppChip[], 
  criteriaChips: AppChip[], 
  tableConfig: AgGridConfig<TimesheetSummary | Timesheet>, 
  noRowsText: string,
  bottomActions: ImmutableArray<BottomBarIconButton>
}

@Component({
  selector: 'app-timesheet-statistic',
  templateUrl: './timesheet-statistic.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetStatisticComponent {
  @ViewChild('statTable') statTable: TimesheetStatisticTableComponent;

  private criteriaChips$: Observable<AppChip[]> = this.facade.criteria$.pipe(
    map(criteria => { 
      const activeCriteriaCount = criteria ? _getSetPropCount(criteria, {dateRangePreset: null}) : 0
      return  this.getCriteriaChips(criteria || {}, activeCriteriaCount)   
    })
  )

  private staticBottomActions: ImmutableArray<BottomBarIconButton>;

  private partialVm$: Observable<Pick<ViewModel, "tableConfig" | "bottomActions">> = 
    this.facade.tableConfig$.pipe(map(tableConfig  => { 
      return {tableConfig, bottomActions: 
        tableConfig.data?.length ? [{text: "Eksporter", icon: "cloud_download", aria: "Eksporter", callback: this.exportAsCsv}, 
        ...this.staticBottomActions] : this.staticBottomActions
      }
    }));

  vm$: Observable<ViewModel> = combineLatest([
    this.facade.groupBy$.pipe(map(x => this.getGroupByChips(x))),
    this.criteriaChips$,
    this.partialVm$,
    this.facade.isFetching$,
  ]).pipe(map(([groupByChips, criteriaChips, {tableConfig, bottomActions}, isFetching]) => { 
    return {groupByChips, criteriaChips, tableConfig, bottomActions, noRowsText: this.getNoRowsText(isFetching)} 
  }))

  navConfig: MainTopNavConfig = {title:  'Timestatistikk'};
  
  constructor( 
    private facade: TimesheetStatisticFacade,
    private formService: FormService,
    private chipsFactory: ChipsFactoryService,
    private exportCsvFormService: ExportCsvFormService
  ) { 
    this.staticBottomActions =  [{...BottomIconButtons.Filter, callback: this.openTimesheetFilter}]
  }

  private openTimesheetFilter = (): void => {
    this.formService.open<TimesheetCriteria, TimesheetCriteriaFormState>({
      formConfig: { ...TimesheetCriteriaForm, initialValue: this.facade.criteria, onlineRequired: true}, 
      formState: this.facade.criteriaFormState$,
      navConfig: {title: "Velg filtre"},
      submitCallback: (val: TimesheetCriteria) => this.facade.updateCriteria(val)
    })
  }

  private resetCriteriaProp(prop: Prop<Immutable<TimesheetCriteria>>, criteria: Maybe<Immutable<TimesheetCriteria>>){
    const clone = {...criteria || {}};
    clone[prop] = undefined;
    this.facade.updateCriteria(clone);
  }

  private exportAsCsv = () => 
    this.exportCsvFormService.open(this.statTable.dataGrid);

  private addGroupBy = (groupBy: GroupByPeriod) => this.facade.updateGroupBy(groupBy);

  private getGroupByChips(groupBy: Maybe<GroupByPeriod>):  AppChip[] {
    return this.chipsFactory.createEnumSelectionChips(GroupByPeriod, groupBy, this.addGroupBy);
  }

  private getCriteriaChips(criteria: Immutable<TimesheetCriteria>, activeCriteriaCount: number): AppChip[] {
    if(activeCriteriaCount === 0) 
      return [{text: "Åpne filter", color: "accent", onClick: this.openTimesheetFilter}]
  
    return this.chipsFactory.createCriteriaChips(criteria, 
        (prop) => this.resetCriteriaProp(prop, criteria), 
        TimesheetCriteriaChipOptions
      )
  }

  private getNoRowsText(isFetching: boolean): string {
    if(!navigator.onLine) return "Mangler internett-tilkobling";
    return isFetching ? 'Laster inn timer...' : 'Finner ingen timer med gitte filtre';
  }

}
