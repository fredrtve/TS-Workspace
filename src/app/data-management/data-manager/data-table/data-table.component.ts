import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { AgGridTableComponent } from 'src/app/shared/components/abstracts/ag-grid-table.component';
import { translations } from 'src/app/shared-app/translations';
import { ConfirmDialogComponent, ConfirmDialogConfig } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableConfig } from './data-table.config';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent extends AgGridTableComponent<any> {

  @Output() itemEdited = new EventEmitter();
  @Output() itemsDeleted = new EventEmitter();
  @Output() createItem = new EventEmitter();

  columnDefs: any = [];
  rowData: any = [];

  constructor(private dialog: MatDialog) { super() }

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
      def['cellEditorParams'] = { values: ['Ja', 'Nei']}

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

    if(DataTableConfig.objectProperties[name]){
      def['valueGetter'] = function(params) { //Get name of object and display
        if(params.data[name])
          return params.data[name].name;
        else return ''
      };

    }

    return def;
  }
  
}
