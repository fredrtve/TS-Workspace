import { Immutable } from "global-types";
import { ControlOverridesMap, DynamicControl, DynamicControlGroup, ValidControlObject } from "../interfaces";
import { _isControlGroup, _isFormStateSelector } from "../type.helpers";

function _mergeValues<T extends object>(mergeInto?: Partial<T>, values?: Partial<T>, basePath?: string): Partial<T> {
    if(mergeInto === undefined) return values === undefined ? {} : values;
    const merged = {...mergeInto, ...values};
    if(basePath === undefined) return merged;
    for(const prop in mergeInto){
        if(values && (<any> values)[prop] !== undefined) continue; //Ignore values that are overridden
        const value = merged[prop];
        if(!_isFormStateSelector(value)) continue; 
        const slicesWithBasePath = [];
        for(const slice of value.formSlice) slicesWithBasePath.push(basePath + '.' + slice)
        merged[prop] = <any> {...value, formSlice: slicesWithBasePath, baseFormPath: basePath}
    }
    return merged;
}

function _mergeControl<T extends DynamicControl<any,any>>(mergeInto?: Partial<T>, control?: Partial<T>, baseUrl?: string): Partial<T> {
    const merged = _mergeValues(mergeInto, control, baseUrl);
    merged.viewOptions = _mergeValues(
        mergeInto === undefined ? undefined : mergeInto.viewOptions, 
        control === undefined ? undefined : control.viewOptions, 
        baseUrl
    );
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

        if(_isControlGroup(controlMergeInto) || _isControlGroup(control))
            merged.overrides[controlName] = _mergeGroup<any>(controlMergeInto, control, basePath);
        else 
            merged.overrides[controlName] = _mergeControl<any>(controlMergeInto, control, basePath);
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
    else return <T> _mergeControl(<any>mergeInto, <T> control);
}

export function _mergeOverridesWithControls<TControls extends ValidControlObject<any>>(
    controls: Immutable<TControls>, 
    overrides?: Immutable<ControlOverridesMap<any, any, TControls>>, 
    basePath?: string
): Immutable<TControls> {
    const result: Partial<TControls> = {};
    for(const controlName in controls){
        const path = basePath === undefined ? controlName : basePath+'.'+controlName;
        result[controlName] = <any> _mergeWithOptions(
            controls[controlName], 
            overrides?.[<keyof {}> controlName],
            path
        );
    }
    return <Immutable<TControls>> result;
}