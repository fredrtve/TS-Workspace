import { Component, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { TimesheetSummary } from 'src/app/shared-app/interfaces';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/core/models';

@Component({
  selector: 'app-timesheet-statistic-table',
  templateUrl: './timesheet-statistic-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetStatisticTableComponent {
  @ViewChild('dataGrid') dataGrid: AgGridAngular;

  _timesheetSummaries: TimesheetSummary[];
  get timesheetSummaries(): TimesheetSummary[] {
      return this._timesheetSummaries;
  }
  
  @Input('timesheetSummaries')
  set timesheetSummaries(value: TimesheetSummary[]) {
      this._timesheetSummaries = value;
      this.initNgGrid(this.timesheetSummaries);
  }

  columnDefs: any = [];

  rowData: any = [];

  constructor(private datePipe: DatePipe) { }

  autoSizeGrid(){
    let cols = this.dataGrid.columnApi.getAllColumns().filter(x => x.getColId() != 'checkbox')
    this.dataGrid.columnApi.autoSizeColumns(cols);
  }

  private initNgGrid(data: TimesheetSummary[]){
    this.columnDefs = [];
    this.rowData = [];

    if(!data || data.length == 0) return null;

    const propertyNames = Object.getOwnPropertyNames(data[0]); 

    //this.columnDefs.push({colId: 'checkbox', checkboxSelection: true, width: 42, pinned: 'left', lockPosition: true})
    
    if(propertyNames.includes('year'))
      this.columnDefs.push({field: 'year',headerName: 'År',sortable: true});

    if(propertyNames.includes('month'))
      this.columnDefs.push({field: 'month',headerName: 'Måned',sortable: true, valueFormatter: this.convertMonthIndex});

    if(propertyNames.includes('week'))
      this.columnDefs.push({field: 'week',headerName: 'Uke',sortable: true});

    if(propertyNames.includes('date'))
      this.columnDefs.push({field: 'date',headerName: 'Dato',sortable: true, valueFormatter: this.convertDate});

    this.columnDefs.push({field: 'fullName',headerName: 'Ansatt',sortable: true});

    this.columnDefs.push({field: 'confirmedHours',headerName: 'Låste timer',sortable: true});

    this.columnDefs.push({field: 'openHours',headerName: 'Åpne timer',sortable: true});

    let totalOpenHrs = data.reduce((total, summary) => { return total + summary.openHours }, 0);
    let totalConfirmedHrs = data.reduce((total, summary) => { return total + summary.confirmedHours }, 0);

    if(this.dataGrid){
      this.dataGrid.api.setPinnedBottomRowData([{openHours: totalOpenHrs, confirmedHours: totalConfirmedHrs, userName: "Sum av timer", timesheets: []}]);
    }
    
    this.rowData = data;
  }

  private convertMonthIndex = (params) => {
    if(params.value == undefined) return undefined;
    return this.datePipe.transform(new Date().setMonth(params.value), 'MMM');
  }

  private convertDate = (params) => {
    if(params.value == undefined) return undefined;
    return this.datePipe.transform(params.value)
  }
}