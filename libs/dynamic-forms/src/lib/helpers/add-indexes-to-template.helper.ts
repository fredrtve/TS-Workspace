import { UnknownState } from "@fretve/global-types";
import { AbstractDynamicControl, DynamicControlGroup } from "../interfaces";
import { _isControlArray, _isControlGroup, _isReactiveSelector } from "./type.helpers";

const indexRegex = new RegExp("{index}")

function _addIndexesToObj<T>(template: T, index: number): T {
    const withIndexes = {...template};
    for(const prop in template){
        const value = template[prop];
        if(!_isReactiveSelector(value)) continue;
        withIndexes[prop] = { ...value, 
            baseFormPath: value.baseFormPath?.replace(indexRegex, <string><any> index) };
    }
    return withIndexes;
}

function _addIndexesToControlGroup<T extends DynamicControlGroup<any,any,any,any,any>>(template: T, index: number): T {
    const controls: UnknownState = { };
    for(const controlName in template.controls)
        controls[controlName] = _addIndexesToTemplate(template.controls[controlName], index)
    return {...template, controls};
}

export function _addIndexesToTemplate<T extends AbstractDynamicControl<any, any, any, any, any>>(template: T, index: number): T {
    const withIndexes = _addIndexesToObj(template, index);
    withIndexes.viewOptions = _addIndexesToObj(template.viewOptions, index);
    if(_isControlGroup(withIndexes)) return _addIndexesToControlGroup(withIndexes, index);
    if(_isControlArray(withIndexes)) 
        withIndexes.controlTemplate = _addIndexesToTemplate(withIndexes.controlTemplate, index);
    return withIndexes;
}