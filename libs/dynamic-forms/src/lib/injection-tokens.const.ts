import { InjectionToken } from '@angular/core';
import { DynamicFormDefaultOptions } from './interfaces';

/** A token for providing default configuration options for dynamic forms */
export const DYNAMIC_FORM_DEFAULT_OPTIONS = new InjectionToken<DynamicFormDefaultOptions>("DynamicFormDefaultOptions");