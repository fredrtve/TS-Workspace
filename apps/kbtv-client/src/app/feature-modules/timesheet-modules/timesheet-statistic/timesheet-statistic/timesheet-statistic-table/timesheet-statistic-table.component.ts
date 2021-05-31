import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Timesheet } from '@core/models';
import { AgGridConfig } from '@shared/components/abstracts/ag-grid-config.interface';
import { AgGridTableComponent } from '@shared/components/abstracts/ag-grid-table.component';
import { TimesheetSummary } from '@shared-timesheet/interfaces';
import { ColDefsFactoryService } from './col-defs-factory.service';
import { Immutable } from 'global-types';

@Component({
  selector: 'app-timesheet-statistic-table',
  templateUrl: './timesheet-statistic-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ColDefsFactoryService]
})
export class TimesheetStatisticTableComponent extends AgGridTableComponent<TimesheetSummary | Timesheet, AgGridConfig<TimesheetSummary | Timesheet>> {

  @Input() overlayNoRowsTemplate: HTMLElement;
  private isSummaryData: boolean;

  constructor(private colDefsFactory: ColDefsFactoryService) { super(); }

  protected initNgGrid(cfg: AgGridConfig<TimesheetSummary | Timesheet>): void{  
    if(!cfg?.data || cfg.data.length === 0) return super.initNgGrid(cfg);

    const sample = <Immutable<TimesheetSummary>> cfg.data[0];
    this.isSummaryData = (sample.confirmedHours || sample.openHours) ? true : false

    super.initNgGrid(cfg);

    this.dataGrid?.api.setPinnedBottomRowData(
      this.isSummaryData ? 
      this.addSummaryBottomRow(<AgGridConfig<TimesheetSummary>> cfg) : 
      this.addTimesheetBottomRow(<AgGridConfig<Timesheet>> cfg) 
    );  
  }

  protected addColDefs(object: TimesheetSummary | Timesheet): ColDef[]{
    return this.colDefsFactory.createColDefs(object);
  } 

  private addSummaryBottomRow(cfg: AgGridConfig<TimesheetSummary>): TimesheetSummary[]{
    if(!cfg.data) return [];
    let openHrs = 0, confirmedHrs = 0;
  
    for(let  i = cfg.data.length; i--;){
      const summary = cfg.data[i];
      openHrs += summary.openHours;
      confirmedHrs += summary.confirmedHours;
    }
 
    return [{
      openHours: Math.round(openHrs * 10) / 10, 
      confirmedHours: Math.round(confirmedHrs * 10) / 10, 
      fullName: "Sum av timer", timesheets: []
    }];   
  }

  private addTimesheetBottomRow(cfg: AgGridConfig<Timesheet>): unknown[]{
    if(!cfg.data) return [];
    let totalHours = 0;
    
    for(let  i = cfg.data.length; i--;){
      const timesheet = cfg.data[i];
      totalHours += timesheet.totalHours || 0;
    }
 
    return [{
      totalHours: Math.round(totalHours * 10) / 10, 
      fullName: "Sum av timer",
    }];   
  }

   
}