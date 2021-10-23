import { Immutable } from "global-types";
import { ControlOverridesMap, DynamicControlField, DynamicControlArray, DynamicControlGroup, GenericControlObject, ValidControlObject } from "../interfaces";
import { _isControlArray, _isControlGroup, _isFormStateSelector } from "./type.helpers";

function _mergeValues<T extends object>(mergeInto?: Partial<T>, values?: Partial<T>, basePath?: string): Partial<T> {
    if(mergeInto === undefined) return values === undefined ? {} : values;
    const merged = {...mergeInto, ...values};
    if(basePath === undefined) return merged;
    for(const prop in mergeInto){
        if(values && (<any> values)[prop] !== undefined) continue; //Ignore values that are overridden
        const value = merged[prop];
        if(!_isFormStateSelector(value)) continue; 
        merged[prop] = <any> {...value, baseFormPath: basePath}
    }
    return merged;
}

function _mergeControl(mergeInto: any, overrides: any, baseUrl?: string){
    if(_isControlGroup(mergeInto) || _isControlGroup(overrides))
        return _mergeGroup<any>(mergeInto, overrides, baseUrl);
    else if(_isControlArray(mergeInto) || _isControlArray(overrides)) 
        return _mergeArray<any>(mergeInto, overrides, baseUrl);  
    else 
        return _mergeField<any>(mergeInto, overrides, baseUrl);
}

function _mergeField<T extends DynamicControlField<any,any>>(mergeInto?: Partial<T>, control?: Partial<T>, baseUrl?: string): Partial<T> {
    const merged = _mergeValues(mergeInto, control, baseUrl);

    merged.viewOptions = _mergeValues(
        mergeInto === undefined ? undefined : mergeInto.viewOptions, 
        control === undefined ? undefined : control.viewOptions, 
        baseUrl
    );
    return merged
}

function _mergeArray<T extends DynamicControlArray<any,any>>(mergeInto?: Partial<T>, control?: Partial<T>, baseUrl?: string): Partial<T> {
    const merged = _mergeValues(mergeInto, control, baseUrl);

    merged.viewOptions = <any> _mergeValues(
        mergeInto === undefined ? undefined : mergeInto.viewOptions, 
        control === undefined ? undefined : control.viewOptions, 
        baseUrl
    );

    merged.templateOverrides = _mergeControl(mergeInto?.templateOverrides, control?.templateOverrides, baseUrl);

    return merged
}

function _mergeGroup<T extends DynamicControlGroup<any, any, any>>(mergeInto?: Partial<T>, group?: Partial<T>, basePath?: string): Partial<T> {
    const merged = _mergeValues(mergeInto, group, basePath);

    merged.viewOptions = _mergeValues(
        mergeInto === undefined ? undefined : mergeInto.viewOptions, 
        group === undefined ? undefined : group.viewOptions,  
        basePath
    );

    merged.overrides = group === undefined 
        ? { ...mergeInto?.overrides } 
        : { ...mergeInto?.overrides, ...group.overrides };

    for(const controlName in merged.overrides){
        const control = group?.overrides?.[controlName];
        const controlMergeInto = mergeInto?.overrides?.[controlName];
        merged.overrides[controlName] = _mergeControl(controlMergeInto, control, basePath)
    }

    return merged;
}

function _mergeWithOptions<T>(mergeInto: T, control?: Partial<T>, basePath?: string): T {
    // if(mergeInto === undefined) return <T> control;
    if(_isControlGroup(mergeInto)){
        const merged = _mergeGroup(mergeInto, control, basePath);
        merged.controls = <any> _mergeOverridesWithControls(merged.controls, merged.overrides, basePath); 
        return <T><unknown> merged;
    }

    if(_isControlArray(mergeInto)){ 
        const merged = _mergeArray(<any> mergeInto, control, basePath);
        merged.controlTemplate = _mergeWithOptions(merged.controlTemplate, merged.templateOverrides, basePath);
        return <T><unknown> merged;
    }

    return <T> _mergeField(<any>mergeInto, <T> control);
}

export function _mergeOverridesWithControls<TControls extends GenericControlObject>(
    controls: Immutable<TControls>, 
    overrides?: Immutable<ControlOverridesMap<any, any, TControls>>, 
    basePath?: string
): Immutable<TControls> {
    const result: any = {};
    for(const controlName in controls){
        let path = basePath === undefined ? controlName : basePath+'.'+controlName;
        if(_isControlArray(controls[controlName])) path = path + ".{index}";
        result[controlName] = <any> _mergeWithOptions(
            controls[controlName], 
            overrides?.[<keyof {}> controlName],
            path
        );
    }
    return <Immutable<TControls>> result;
}