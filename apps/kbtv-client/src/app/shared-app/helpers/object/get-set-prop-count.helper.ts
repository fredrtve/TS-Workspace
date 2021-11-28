import { Immutable, UnknownState } from '@fretve/global-types';
import { _isNullOrEmpty } from '../is-null-or-empty.helper';

export function _getSetPropCount(obj: Immutable<UnknownState>, ignoredProps: UnknownState): number{
    let setPropCount = 0;
    for(const key in obj){
        const value = obj[key];
        const ignoredVal = ignoredProps[key];
        if(ignoredVal === value || ignoredVal === null) continue;
        if(typeof value === "string" && !_isNullOrEmpty(value)) setPropCount++;
        else if(typeof value !== "string" && value != null) setPropCount++;
    }   
    return setPropCount;
}


    
