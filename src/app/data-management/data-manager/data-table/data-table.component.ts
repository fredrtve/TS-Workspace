import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ModelConfig, ModelStateConfig, ModelStateConfigData } from 'src/app/core/model/model-state.config';
import { ModelState } from 'src/app/core/model/model.state';
import { Model } from 'src/app/core/models/base-entity.interface';
import { ArrayHelperService } from 'src/app/core/services';
import { translations } from 'src/app/shared-app/translations';
import { AgGridTableComponent } from 'src/app/shared/components/abstracts/ag-grid-table.component';
import { ConfirmDialogComponent, ConfirmDialogConfig } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DataConfig } from '../../interfaces/data-config.interface';
import { DataTableConfig } from './data-table.config';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent extends AgGridTableComponent<Model, DataConfig> {

  @Output() itemEdited = new EventEmitter();
  @Output() itemsDeleted = new EventEmitter();
  @Output() createItem = new EventEmitter();

  columnDefs: any = [];
  rowData: any = [];

  //Create map with foreignProp as key, to lookup via model class properties
  private propCfgMap: {[foreignKey: string]: ModelConfig<ModelState> & {stateProp: string}} = {};
  private foreignsIdMap: {[foreignKey: string]: {[id: string]: Model}} = {}
  private foreignsDisplayMap: {[foreignKey: string]: {[displayProp: string]: Model}} = {}

  constructor(
    private dialog: MatDialog,
    private arrayHelperService: ArrayHelperService,
  ) { super() }

  ngOnInit(): void {
    for(let modelKey in ModelStateConfigData){
      const modelCfg = ModelStateConfigData[modelKey];
      this.propCfgMap[modelCfg.foreignKey] = {...modelCfg, stateProp: modelKey};
    }
    console.log(this.propCfgMap)
  }

  editCell = (e:any) => {
    if(e.newValue !== e.oldValue){
      this.itemEdited.emit(e);
    }
  };
  
  openDeleteDialog = () => {
    let nodes = this.dataGrid.api.getSelectedNodes();
    if(nodes?.length == 0) return null;
    
    let config: ConfirmDialogConfig = {message: 'Slett ressurs(er)?', confirmText: 'Slett'};
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {data: config});

    deleteDialogRef.afterClosed().pipe(filter(res => res))
      .subscribe(res =>  this.itemsDeleted.emit(nodes.map(node => node.data['id'])));
  }

  protected initNgGrid(cfg:DataConfig): void{
    console.time('initNgGrid')
    if(!cfg) return super.initNgGrid(cfg);
    const modelCfg = ModelStateConfig.get(cfg.selectedProp);
    if(modelCfg.foreigns){
      for(const fkStateKey of modelCfg.foreigns){
        const fkCfg = ModelStateConfig.get(fkStateKey);
        const entities = cfg.foreigns[fkStateKey];
        if(entities){
          this.foreignsIdMap[fkCfg.foreignKey] = 
            this.arrayHelperService.convertArrayToObject(entities, fkCfg.identifier);
          this.foreignsDisplayMap[fkCfg.foreignKey] = 
            this.arrayHelperService.convertArrayToObject(entities, fkCfg.displayProp);
        }
      };
    }
    console.timeEnd('initNgGrid')
    super.initNgGrid(cfg);
  }

  protected addColDefs(object: Object): any[]{
    const colDefs = [{colId: 'checkbox', checkboxSelection: true, width: 42, pinned: 'left', lockPosition: true}];
    for(const prop in object){
      const colDef = this.addColDef(prop);
      if(colDef) colDefs.push(colDef)
    }
    return colDefs;
  }

  private addColDef(name: string): any{
    if(DataTableConfig.ignoredProperties[name]) return null; //Ignored properties

    let def = {
      field: name,
      headerName: translations[name] || name,
      sortable: true,
      resizable: true,
      editable: true,
      lockPosition: true
    };

    if(DataTableConfig.booleanProperties[name]){
      def['cellEditor'] = 'agSelectCellEditor';
      def['cellEditorParams'] = { values: ['Ja', 'Nei'] }

      def['valueGetter'] = function(params){return params.data[name] == true ? 'Ja' : 'Nei'}

      def['valueSetter'] = function(params){
        let val = params.newValue.toLowerCase();
        if(val == 'ja') params.data[name] = true;
        else if (val == 'nei') params.data[name] = false;
        else return false;
        return true;
      }
    }

    if(DataTableConfig.noEditProperties[name]) def['editable'] = false;

    const propModelCfg = this.propCfgMap[name];
    if(propModelCfg){
      const fkIdProp = name;
      const propModelCfg = this.propCfgMap[fkIdProp];

      def['cellEditor'] = 'agSelectCellEditor';
      def['cellEditorParams'] = { 
        values: Object.keys(this.foreignsDisplayMap[fkIdProp]), 
      }
      
      def['valueGetter'] = (params) => { //Get name of fkId and display
        const fkId = params.data[fkIdProp];
        if(fkId){
          return this.foreignsIdMap[fkIdProp][fkId][propModelCfg.displayProp];
        }
        else return ''
      };

      def['valueSetter'] = (params) => {
        const hit = this.foreignsDisplayMap[fkIdProp][params.newValue]
        if(hit) params.data[fkIdProp] = hit[propModelCfg.identifier];
        else return false;
        return true;
      }
    }

    return def;
  }
  
}
