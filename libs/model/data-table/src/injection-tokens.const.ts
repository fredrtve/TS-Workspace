import { InjectionToken } from "@angular/core";
import { DataTableValidationErrorMap, ModelDataTablesConfig } from "./interfaces";

export const MODEL_DATA_TABLES_CONFIG = new InjectionToken<ModelDataTablesConfig<unknown>>("ModelDataTablesConfig")

/** A token for providing global validation error messages for all forms */
export const MODEL_DATA_TABLE_VALIDATION_ERROR_MESSAGES = new InjectionToken<DataTableValidationErrorMap>('DataTableValidationErrorMessages');