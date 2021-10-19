import { Injectable } from "@angular/core";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { AgGridAngular } from "ag-grid-angular";
import { ValueFormatterParams } from "ag-grid-community";
import { FormService } from "form-sheet";
import { Immutable } from "global-types";
import { KeyOptions, MultiCheckboxForm, _createMultiCheckboxForm } from "./create-multi-checkbox-form.helper";

@Injectable({providedIn: "any"})
export class ExportCsvFormService {

    constructor(private formService: FormService){}

    open(grid: AgGridAngular): void{
        if(!grid.columnDefs?.length) return;
        
        const keyOptions: KeyOptions[] = [];
        const selections: Record<string, boolean> = {};

        for(const def of grid.columnDefs){
          keyOptions.push( { key: def.colId || def.field || "Ukjent", text: def.headerName || "Ukjent"} )
          selections[def.colId] = true;
        }

        this.formService.open<MultiCheckboxForm<Record<string, boolean>>>(
          {
            formConfig: _createMultiCheckboxForm(keyOptions),
            navConfig: {title: "Eksporter til CSV format"},
            actionConfig: { submitText: "Eksporter", allowPristine: true }
          },
          { initialValue: { selections } },
          (val) => this.onSubmit(val, grid)
        )
    }

    private onSubmit = (formVal: Immutable<MultiCheckboxForm<Record<string, boolean>>>, grid: AgGridAngular): void => {
        const colKeys = [];

        for(const key in formVal.selections)
            if(formVal.selections[key]) colKeys.push(key);

        this.exportAsCsv(colKeys, grid)   
    }   

    private exportAsCsv = (columnKeys: string[], grid: AgGridAngular) => {
        grid.api.exportDataAsCsv({
          columnKeys,
          fileName: _idGenerator(),
          processCellCallback: (params) => {
            const colDef = params.column.getColDef()
            // Use coldef value formatter in export
            if (colDef.valueFormatter instanceof Function) {
              const valueFormatterParams: ValueFormatterParams = {
                ...params,
                data: params.node?.data,
                node: params.node!,
                colDef: params.column.getColDef()
              };
              return colDef.valueFormatter(valueFormatterParams);
            }
            return params.value;
          }
        });
    }
}