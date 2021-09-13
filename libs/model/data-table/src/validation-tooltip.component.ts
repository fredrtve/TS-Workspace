import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';
import { MODEL_DATA_TABLES_CONFIG, MODEL_DATA_TABLE_VALIDATION_ERROR_MESSAGES } from './injection-tokens.const';
import { DataTableValidationErrorMap, DataTableValidationErrors, ModelDataTablesConfig } from './interfaces';

@Component({
  template: ` 
    <div *ngFor="let err of errorMessages">{{err}}</div>
  `,
  styles: [
    `
      :host {
        border-radius: 4px;
        position: absolute;
        width: 200px;
        padding: 12px;
        font-weight: bold;
        pointer-events: none;
        transition: opacity 1s;
        box-shadow: 
            0px 11px 15px -7px rgb(0 0 0 / 20%), 
            0px 24px 38px 3px rgb(0 0 0 / 14%), 
            0px 9px 46px 8px rgb(0 0 0 / 12%)
      }

      :host.ag-tooltip-hiding { opacity: 0; }

    `,
  ],
})
export class ValidationTooltipComponent implements ITooltipAngularComp {
    
    errorMessages: string[] = [];

    constructor(
        @Inject(MODEL_DATA_TABLE_VALIDATION_ERROR_MESSAGES) private errorMessageMap: DataTableValidationErrorMap,
        @Inject(MODEL_DATA_TABLES_CONFIG) private tableConfigs: ModelDataTablesConfig<any>,
        elementRef: ElementRef,
        renderer: Renderer2
    ){
        renderer.addClass(elementRef.nativeElement, this.tableConfigs.validationErrorClass);
    }

    agInit(params: { validationErrors: () => DataTableValidationErrors } & ITooltipParams): void {
        const map = params.validationErrors();
        const errorMap = map[params.node.id]?.[params.colDef.field];
        for(const prop in errorMap){
            const fn = this.errorMessageMap[prop];
            if(fn) this.errorMessages.push(fn(errorMap[prop]))
            else console.error('Missing error display function for validator ' + prop)
        }

    }
}