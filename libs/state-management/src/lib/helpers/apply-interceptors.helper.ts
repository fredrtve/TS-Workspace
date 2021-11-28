import { Immutable, ImmutableArray, Maybe } from '@fretve/global-types';
import { ActionInterceptor, StateAction } from '../interfaces';

export function _applyInterceptors(
    action: Immutable<StateAction>, 
    interceptors: ImmutableArray<ActionInterceptor>): Maybe<StateAction> {
    if(!interceptors?.length) return action;
    let result: Maybe<StateAction> = {...action};
    for(const interceptor of interceptors) if(result) result = interceptor.intercept(result)
    return result;
}