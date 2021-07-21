import { InjectionToken } from '@angular/core'
import { ValidationErrorMap } from './interfaces';

/** A token for providing global validation error messages for all forms */
export const VALIDATION_ERROR_MESSAGES = new InjectionToken<ValidationErrorMap>('ValidationErrorMessages');