import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { UnknownState } from '@fretve/global-types';
import { Observable } from 'rxjs';
import { ValidationTooltipComponent } from '../validation-tooltip.component';
import { ModelDataTableFacade, ViewModel } from './model-data-table.facade';

/** Responsible for wrapping an AgGridAngular component. 
 *  It provides the table with model data & listens to changes for updates. */
@Component({
  selector: 'lib-model-data-table',
  templateUrl: './model-data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[ModelDataTableFacade]
})
export class ModelDataTableComponent {
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    @Input() agGridTheme: string;

    @Input('modelProperty') 
    set modelProperty(value: string) { 
      this.facade.updateSelectedProperty(value); 
    }

    frameworkComponents = { validationTooltip: ValidationTooltipComponent };

    vm$: Observable<ViewModel> = this.facade.vm$;

    constructor(private facade: ModelDataTableFacade) {}

    autoSizeGrid(){
        let cols = this.agGrid.columnApi.getAllColumns()?.filter(x => x.getColId() != 'checkbox')
        if(cols) this.agGrid.columnApi.autoSizeColumns(cols);
    }

    getRowNodeId = (t: UnknownState) => 
        this.facade.modelIdentifier ? t[this.facade.modelIdentifier] : null
    
}
