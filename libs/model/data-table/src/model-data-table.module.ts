import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AgGridModule } from "ag-grid-angular";
import { ModelDataTableComponent } from "./model-data-table/model-data-table.component";
import { ValidationTooltipComponent } from "./validation-tooltip.component";

/** Responsible for exporting the {@link ModelDataTableComponent}. */
@NgModule({
    declarations: [ModelDataTableComponent, ValidationTooltipComponent],
    imports: [ 
        CommonModule,
        AgGridModule.withComponents([ValidationTooltipComponent]) 
    ],
    exports: [ModelDataTableComponent],
  })
  export class ModelDataTableModule { }
  