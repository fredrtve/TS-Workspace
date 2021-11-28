import { InjectionToken } from '@angular/core';
import { KeyVal } from '@fretve/global-types';

/** Used to inject translations for model properties. */
export const MODEL_PROP_TRANSLATIONS = new InjectionToken<KeyVal<string>>('ModelPropTranslations')

/** Used to inject translations for model state props properties. */
export const MODEL_STATE_PROP_TRANSLATIONS = new InjectionToken<ModelStatePropTranslations>('ModelStatePropTranslations')

export type ModelStatePropTranslations = KeyVal<{singular: string, plural: string}>;