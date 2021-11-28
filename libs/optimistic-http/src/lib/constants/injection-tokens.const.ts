import { InjectionToken } from '@angular/core';
import { Prop } from '@fretve/global-types';
import { StateAction } from 'state-management';
import { ActionRequestMap } from '../interfaces';

export const OPTIMISTIC_STATE_PROPS = new InjectionToken<Prop<unknown>[]>('RootOptimisticStateProps');
export const OPTIMISTIC_BASE_API_URL = new InjectionToken<string>('OptimisticBaseApiUrl');
export const ACTION_REQUEST_MAP = new InjectionToken<ActionRequestMap<StateAction>>('ModelCommandApiMap');
