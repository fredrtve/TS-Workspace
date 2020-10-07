import { Input, ViewChild, Directive } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AgGridConfig } from './ag-grid-config.interface';

@Directive()
export abstract class AgGridTableComponent<TRecord, TConfig extends AgGridConfig<TRecord>> {
  @ViewChild('dataGrid') dataGrid: AgGridAngular;

  private _config: TConfig;
  get config(): TConfig { return this._config; }

  @Input() set config(value: TConfig) {
      this._config = value;
      this.initNgGrid(value);
  }

  columnDefs: ColDef[] = [];

  rowData: any[] = [];

  private currentObject: TRecord;

  constructor() { }

  autoSizeGrid(){
    let cols = this.dataGrid.columnApi.getAllColumns().filter(x => x.getColId() != 'checkbox')
    this.dataGrid.columnApi.autoSizeColumns(cols);
  }

  protected abstract addColDefs(object: Object): ColDef[];

  protected initNgGrid(cfg: TConfig): void{
    
    if(!cfg?.data || cfg.data.length === 0){ //Reset grid if no data
      this.columnDefs = [];
      this.rowData = [];
      this.currentObject = null;
      return;
    };

    const record = cfg.data[0];
    if(!this.hasSameObjectProps(record, this.currentObject)){
      this.currentObject = record;
      this.columnDefs = this.addColDefs(record);
    }

    this.rowData = cfg.data;
  }

  protected hasSameObjectProps(obj1: Object, obj2: Object): boolean{
    let objProps1 = Object.keys(obj1 || {});

    if(objProps1.length !== Object.keys(obj2 || {}).length) return false;

    for(const prop of objProps1){
      if(!obj2.hasOwnProperty(prop)) return false   
    }

    return true;
  }


}