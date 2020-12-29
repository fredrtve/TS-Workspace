import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Model } from '@core/models/base-entity.interface';
import { ModelStateConfig } from 'state-model';
import { _convertArrayToObject } from 'array-helpers';
import { AgGridTableComponent } from '@shared/components/abstracts/ag-grid-table.component';
import { translations } from '@shared/translations';
import { DataConfig } from '../../interfaces/data-config.interface';
import { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { Immutable, Maybe } from 'global-types';
import { DataTablePropConfig } from './data-table.config';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent extends AgGridTableComponent<Model, DataConfig> {

  @Output() itemEdited = new EventEmitter();

  columnDefs: ColDef[] = [];
  rowData: Model[] = [];

  private fkModelIdMap: {[foreignKey: string]: {[id: string]: Maybe<Immutable<Model>>}} = {}

  private fkModelDisplayPropMap: {[foreignKey: string]: {[displayProp: string]: Maybe<Immutable<Model>>}} = {}

  constructor() { 
    super(); 
  }

  editCell = (e: CellValueChangedEvent) => {
    if(e.newValue !== e.oldValue){
      this.itemEdited.emit(e);
    }
  };

  protected initNgGrid(cfg: DataConfig): void{
    if(!cfg) return super.initNgGrid(cfg);
    const modelCfg = ModelStateConfig.get(cfg.selectedProp);
    if(modelCfg?.foreigns){
      for(const fkStateKey of modelCfg.foreigns){
        const fkCfg = ModelStateConfig.get(fkStateKey);
        const entities = cfg.foreigns[fkStateKey];
        if(entities){
          this.fkModelIdMap[<string> fkCfg.foreignKey] = 
            _convertArrayToObject<Model>(entities, fkCfg.identifier);
          this.fkModelDisplayPropMap[<string> fkCfg.foreignKey] = 
            _convertArrayToObject<Model>(entities, fkCfg.displayProp);
        }
      };
    }
    super.initNgGrid(cfg);
  }

  protected addColDefs(object: Object): ColDef[]{
    const colDefs: ColDef[] = [{colId: 'checkbox', checkboxSelection: true, width: 42, pinned: 'left', lockPosition: true}];
    for(const prop in object){
      const colDef = this.addColDef(prop);
      if(colDef) colDefs.push(colDef)
    }
    return colDefs;
  }

  private addColDef(name: string): Maybe<ColDef> {
    if(DataTablePropConfig.ignored[name]) return; //Ignored properties

    let def: ColDef = {
      field: name,
      headerName: translations[name?.toLowerCase()] || name,
      sortable: true,
      resizable: true,
      editable: true,
      lockPosition: true
    };

    if(DataTablePropConfig.boolean[name]){
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

    if(DataTablePropConfig.noEdit[name]) def['editable'] = false;

    const fkModelCfg = ModelStateConfig.getBy(name, "foreignKey");

    if(fkModelCfg){
      const fkIdProp = name;

      def['cellEditor'] = 'agSelectCellEditor';
      def['cellEditorParams'] = { 
        values: Object.keys(this.fkModelDisplayPropMap[fkIdProp] || {}), 
      }

      def['valueGetter'] = (params) => { //Get name of fkId and display
        const fkId = params.data[fkIdProp];
        if(fkId){
          const fkEntity = this.fkModelIdMap[fkIdProp][fkId];
          return fkEntity ? fkEntity[fkModelCfg.displayProp || fkModelCfg.identifier] : null;
        }
        else return ''
      };

      def['valueSetter'] = (params) => {
        const hit = this.fkModelDisplayPropMap[fkIdProp][params.newValue];
        if(hit) params.data[fkIdProp] = hit[fkModelCfg.identifier];
        else return false;
        return true;
      }
    }

    return def;
  }
  
}
