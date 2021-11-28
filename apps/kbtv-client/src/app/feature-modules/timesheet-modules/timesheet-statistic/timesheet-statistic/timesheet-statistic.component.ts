import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Timesheet } from '@core/models';
import { GroupByPeriod } from '@shared-app/enums/group-by-period.enum';
import { _enumSelectionChipsFactory } from '@shared-app/helpers/chips/enum-selection-chips-factory.helper';
import { _getSetPropCount } from '@shared-app/helpers/object/get-set-prop-count.helper';
import { AppChip } from '@shared-app/interfaces/app-chip.interface';
import { _timesheetCriteriaChipsFactory } from '@shared-timesheet/helpers/timesheet-criteria-chips-factory.helper';
import { TimesheetSummary } from '@shared-timesheet/interfaces';
import { TimesheetCriteriaFormService } from '@shared-timesheet/timesheet-criteria-form-service';
import { TimesheetCriteria } from '@shared-timesheet/timesheet-filter/timesheet-criteria.interface';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { BottomBarIconButton } from '@shared/components/bottom-action-bar/bottom-bar-icon-button.interface';
import { BottomIconButtons } from '@shared/constants/bottom-icon-buttons.const';
import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';
import { FetchingStatus } from 'model/state-fetcher';
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
    this.facade.fetchingStatus$,
  ]).pipe(map(([groupByChips, criteriaChips, {tableConfig, bottomActions}, status]) => { 
    return {groupByChips, criteriaChips, tableConfig, bottomActions, noRowsText: this.getNoRowsText(status)} 
  }))
  
  constructor( 
    private facade: TimesheetStatisticFacade,
    private criteriaFormService: TimesheetCriteriaFormService,
    private exportCsvFormService: ExportCsvFormService
  ) { 
    this.staticBottomActions =  [{...BottomIconButtons.Filter, callback: this.openTimesheetFilter}]
  }
  
  private openTimesheetFilter = (): void => {
    this.criteriaFormService.open((val) => this.facade.updateCriteria(val), this.facade.criteria)
  }

  private exportAsCsv = () => 
    this.exportCsvFormService.open(this.statTable.dataGrid);

  private addGroupBy = (groupBy: GroupByPeriod) => this.facade.updateGroupBy(groupBy);

  private getGroupByChips(groupBy: Maybe<GroupByPeriod>):  AppChip[] {
    return _enumSelectionChipsFactory(GroupByPeriod, groupBy, this.addGroupBy);
  }

  private getCriteriaChips(criteria: Immutable<TimesheetCriteria>, activeCriteriaCount: number): AppChip[] {
    if(activeCriteriaCount === 0) 
      return [{text: "Åpne filter", color: "accent", onClick: this.openTimesheetFilter}]
  
    return _timesheetCriteriaChipsFactory(criteria, (x) => this.facade.updateCriteria(x))
  }

  private getNoRowsText(status: Maybe<FetchingStatus>): string {
    if(!navigator.onLine) return "Mangler internett-tilkobling";
    switch(status){
      case 'failed': return 'Det oppsto en feil ved innhenting av timer';
      case 'fetching': return 'Laster inn timer...';
      default: return 'Finner ingen timer med gitte filtre';
    }
  }

}
