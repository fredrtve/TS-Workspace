import { Immutable } from "global-types";
import { _weakMemoizer } from "global-utils";
import { _isReactiveSelector } from "../helpers/type.helpers";
import { AbstractDynamicControl } from "../interfaces";
import { ControlArrayOverridables, ControlGroupOverridables, ControlOverridables, ControlOverridesMap, DynamicControlMapFromSchema, ValidControlSchemaMap } from "./interfaces";
import { _isControlArrayOverridables, _isControlArraySchema, _isControlGroupOverridables, _isControlGroupSchema } from "./type.helpers";

function mergeValues<T extends object>(mergeInto?: Partial<T>, values?: Partial<T>, basePath?: string): Partial<T> {
    if(mergeInto === undefined) return values === undefined ? {} : values;
    const merged = {...mergeInto, ...values};
    if(basePath === undefined) return merged;
    for(const prop in mergeInto){
        if(values && (<any> values)[prop] !== undefined) continue; //Ignore values that are overridden
        const value = merged[prop];
        if(!_isReactiveSelector(value)) continue; 
        merged[prop] = <any> {...value, baseFormPath: basePath}
    }
    return merged;
}

function mergeControlOverrides<T extends Partial<ControlOverridables<any,any,any>>>(
    mergeInto?: T, 
    overrides?: Partial<ControlOverridables<any,any,any>>, 
    baseUrl?: string
): T {
    if(_isControlGroupOverridables(mergeInto) || _isControlGroupOverridables(overrides))
        return mergeGroupOverrides(mergeInto, overrides, baseUrl);
    else if(_isControlArrayOverridables(mergeInto) || _isControlArrayOverridables(overrides)) 
        return mergeArrayOverrides(mergeInto, overrides, baseUrl);  
    else 
        return mergeBaseControl(mergeInto, overrides, baseUrl);
}

function mergeBaseControl<T extends Partial<ControlOverridables<any,any,any>>>(
    mergeInto?: T, 
    control?: Partial<ControlOverridables<any,any,any>>, 
    baseUrl?: string
): T {
    const merged = mergeValues(mergeInto, control, baseUrl);

    merged.viewOptions = mergeValues(
        mergeInto === undefined ? undefined : mergeInto.viewOptions, 
        control === undefined ? undefined : control.viewOptions, 
        baseUrl
    );

    return <T> merged
}

function mergeArrayOverrides<T extends Partial<ControlArrayOverridables<any,any,any,any>>>(
    mergeInto?: T, 
    control?: Partial<ControlArrayOverridables<any,any,any,any>>, 
    baseUrl?: string
): T {
    const merged = mergeBaseControl(mergeInto, control, baseUrl);

    merged.templateOverrides = mergeControlOverrides(mergeInto?.templateOverrides, control?.templateOverrides, baseUrl);

    return <T> merged
}

function mergeGroupOverrides<T extends Partial<ControlGroupOverridables<any, any, any, any>>>(
    mergeInto?: T, 
    group?: Partial<ControlGroupOverridables<any, any, any, any>>, 
    basePath?: string
): T {
    const merged = mergeBaseControl(mergeInto, group, basePath);

    merged.overrides = group === undefined 
        ? { ...mergeInto?.overrides } 
        : { ...mergeInto?.overrides, ...group.overrides };

    for(const controlName in merged.overrides){
        const control = group?.overrides?.[controlName];
        const controlMergeInto = mergeInto?.overrides?.[controlName];
        merged.overrides[controlName] = mergeControlOverrides(controlMergeInto, control, basePath)
    }

    return <T> merged;
}

function mergeWithOptions<T extends AbstractDynamicControl<any,any,any,any,any>>(
    mergeInto: T, 
    overrides?: Partial<ControlOverridables<any,any,any>>, 
    basePath?: string
): T {
    if(_isControlGroupSchema(mergeInto)){
        const merged = <any> mergeGroupOverrides(mergeInto, overrides, basePath);
        merged.controls = mergeOverridesWithControls(merged.controls, merged.overrides, basePath); 
        return <T> merged;
    }
    if(_isControlArraySchema(mergeInto)){ 
        const merged = <any> mergeArrayOverrides(mergeInto, overrides, basePath);
        merged.controlTemplate = mergeWithOptions(merged.controlTemplate, merged.templateOverrides, basePath);
        return <T> merged;
    }
    return <T> mergeBaseControl(mergeInto, overrides);
}

function mergeOverridesWithControls<TForm extends object, TControls extends ValidControlSchemaMap<TForm, any>>(
    controls: Immutable<TControls>, 
    overrides?: Immutable<ControlOverridesMap<TForm, any, ValidControlSchemaMap<TForm, any>>>, 
    basePath?: string
): DynamicControlMapFromSchema<TForm, any, TControls> {
    const result: any = {};
    for(const controlName in controls){
        let path = basePath === undefined ? controlName : basePath+'.'+controlName;
        if(_isControlArraySchema(controls[controlName])) path = path + ".{index}";
        result[controlName] = mergeWithOptions(
            <AbstractDynamicControl<any,any,any,any,any>> controls[controlName], 
            overrides?.[<keyof {}> controlName],
            path
        );
    }
    return <any> result;
}

export const _mergeOverridesWithControls = _weakMemoizer(mergeOverridesWithControls)