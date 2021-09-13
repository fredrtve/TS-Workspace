import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { _deleteModelRequest, _setSaveModelRequest } from '@core/configurations/optimistic/global-action-requests';
import { ValidationErrorMessages } from '@core/configurations/validation-error-messages.const';
import { CssLoaderService } from '@core/services/css-loader.service';
import { LazyStyles } from '@shared-app/enums/lazy-styles.enum';
import { SharedModule } from '@shared/shared.module';
import { ModelDataTableModule, MODEL_DATA_TABLES_CONFIG, MODEL_DATA_TABLE_VALIDATION_ERROR_MESSAGES } from 'model/data-table';
import { ModelFormModule } from 'model/form';
import { ModelStateCommandsModule } from 'model/state-commands';
import { ModelStateFetcherModule } from 'model/state-fetcher';
import { OptimisticHttpModule, _createActionRequestMap } from 'optimistic-http';
import { StateManagementModule } from 'state-management';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagerComponent } from './data-manager/data-manager.component';
import { DataPropertyPickerComponent } from './data-manager/data-property-picker/data-property-picker.component';
import { ModelDataTables } from './model-data-tables.const';

@NgModule({
  declarations: [
    DataManagerComponent,
    DataPropertyPickerComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,   
    DataManagementRoutingModule, 

    MatFormFieldModule, 
    MatSelectModule,

    StateManagementModule.forFeature({}),
    ModelStateCommandsModule,
    ModelStateFetcherModule,
    ModelFormModule,
    ModelDataTableModule,

    OptimisticHttpModule.forFeature(_createActionRequestMap(
      _deleteModelRequest,
      _setSaveModelRequest
    )), 
    
  ],
  providers: [
    {provide: MODEL_DATA_TABLES_CONFIG, useValue: ModelDataTables},
    {provide: MODEL_DATA_TABLE_VALIDATION_ERROR_MESSAGES, useValue: ValidationErrorMessages }
  ]
})
export class DataManagementModule { 
  constructor(private cssLoaderService: CssLoaderService){
    this.cssLoaderService.load(LazyStyles.AgGrid);
  }
}
