import { UnknownState } from "global-types";
import { DynamicControlGroup, ValidControl } from "../interfaces";
import { _isControlArray, _isControlGroup, _isFormStateSelector } from "./type.helpers";

const indexRegex = new RegExp("{index}")

function _addIndexesToObj<T>(template: T, index: number): T {
    const withIndexes = {...template};
    for(const prop in template){
        const value = template[prop];
        if(!_isFormStateSelector(value)) continue;
        // const slicesWithIndex = [];
        // for(const slice of value.formSlice) slicesWithIndex.push(slice.replace(indexRegex, <string><any> index))
        withIndexes[prop] = { ...value, 
            baseFormPath: value.baseFormPath?.replace(indexRegex, <string><any> index) };
    }
    return <T> withIndexes;
}

function _addIndexesToControlGroup(template: DynamicControlGroup<any,any,any>, index: number): DynamicControlGroup<any,any,any> {
    const controls: UnknownState = { };
    for(const controlName in template.controls)
        controls[controlName] = _addIndexesToTemplate(template.controls[controlName], index)
    return {...template, controls};
}

export function _addIndexesToTemplate<T extends ValidControl<any>>(template: T, index: number): T {
    const withIndexes = _addIndexesToObj(template, index);
    withIndexes.viewOptions = _addIndexesToObj(template.viewOptions, index);
    if(_isControlGroup(withIndexes)) return <T> _addIndexesToControlGroup(withIndexes, index);
    if(_isControlArray(withIndexes)) 
        withIndexes.controlTemplate = _addIndexesToTemplate(withIndexes.controlTemplate, index);
    return <T> withIndexes;
}