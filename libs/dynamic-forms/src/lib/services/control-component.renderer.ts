import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Optional, Renderer2, Type, ViewContainerRef } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Immutable, Maybe, NotNull } from "global-types";
import { pairwise, startWith } from "rxjs/operators";
import { _isControlArray, _isControlGroup, _isFormStateSelector } from "../helpers/type.helpers";
import { DYNAMIC_FORM_DEFAULT_OPTIONS } from "../injection-tokens.const";
import { AbstractDynamicControl, ControlArrayComponent, ControlFieldComponent, ControlGroupComponent, ControlOptions, DynamicControlArray, DynamicControlField, DynamicControlGroup, DynamicControlMap, DynamicFormDefaultOptions, FormControlType, FormStateSelector } from "../interfaces";
import { FormStateResolver } from "./form-state.resolver";

// type ControlWithSelectors<T extends ControlFieldSchema<any, ControlFieldComponent<any, any>> = ControlFieldSchema<any, ControlFieldComponent<any, any>>> = 
//     Omit<T, keyof DynamicControlFieldOptions> & AllowFormStateSelectors<DynamicControlFieldOptions,any, ControlFieldComponent<any, any>>
  
 type ControlFormComponent<T> = T extends AbstractDynamicControl<any, any, any, (infer C), any> ? NotNull<C> : never;

@Injectable()
export class ControlComponentRenderer {
 
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,       
        @Inject(DYNAMIC_FORM_DEFAULT_OPTIONS) @Optional() private globalOptions: Maybe<DynamicFormDefaultOptions>,
        private resolver: FormStateResolver,
        private renderer: Renderer2,
    ) { }

    renderControls(
        controls: DynamicControlMap<any,any>, 
        formGroup: FormGroup, 
        vcRef: ViewContainerRef
    ): void {
        for(const controlName in controls){
            const formControl = formGroup.get(controlName);
            if(formControl === null) throw Error(`No form control for control with name ${controlName} on group ${formGroup}`)
             const ref = this.renderControl(controls[controlName], <any> formControl, vcRef);
             if(ref) this.renderer.setAttribute(ref.location.nativeElement, "data-cy", "form-"+controlName)
             ref?.instance.onControlInit?.();
        }
    }

    renderControl<TControl extends AbstractDynamicControl<any,any,any,any,any>>(
        controlCfg: Immutable<TControl>, 
        control: FormControlType<TControl>, 
        vcRef: ViewContainerRef
    ): ComponentRef<ControlFormComponent<TControl>> | undefined {

        let ref: ComponentRef<any> | undefined;

        if(_isControlGroup(controlCfg)){
            ref = this.loadGroup(controlCfg, <FormGroup> control, vcRef);
            this.setClass(ref, this.globalOptions?.groupClass)
        }
        else if(_isControlArray(controlCfg)){
            ref = this.loadArray(controlCfg, <FormArray> control, vcRef);
            this.setClass(ref, this.globalOptions?.arrayClass)
        }
        else {
            ref = this.loadField(controlCfg, <FormControl> control, vcRef); 
            if(ref === undefined) return; 
            this.setClass(ref, this.globalOptions?.fieldClass)
        }

        this.setClass(ref, (<ControlOptions> controlCfg).controlClass$)
        
        return <ComponentRef<ControlFormComponent<TControl>>> ref;

    }

    private loadField(
        controlCfg: DynamicControlField<any,any,any,any>,
        control: FormControl, 
        vcRef: ViewContainerRef
    ): ComponentRef<ControlFieldComponent<object | null, object>> | undefined {
        if(!controlCfg.viewComponent) return;
        
        const componentRef = this.loadComponent(controlCfg.viewComponent, vcRef);

        componentRef.instance.formControl = control;

        componentRef.instance.viewOptionSelectors = controlCfg.viewOptions || {};

        componentRef.instance.requiredSelector = controlCfg.required$;

        return componentRef;
    }

    private loadGroup(
        groupCfg: Immutable<DynamicControlGroup<any, any, any, any, any>>, 
        formGroup: FormGroup, 
        vcRef: ViewContainerRef
    ): ComponentRef<ControlGroupComponent<any, any>> {
        const viewComponent = groupCfg.viewComponent || this.globalOptions?.groupViewComponent;

        if(!viewComponent) throw Error("Missing control group component, Either specify in configuration or set a default component.")

        const componentRef = this.loadComponent(viewComponent, vcRef);

        componentRef.instance.viewOptionSelectors = groupCfg.viewOptions;

        componentRef.instance.controls = groupCfg.controls;
        
        componentRef.instance.formControl = formGroup;

        return componentRef;   
    }

    private loadArray(
        arrayCfg: Immutable<DynamicControlArray<any,any,any,any,any>>, 
        formArray: FormArray, 
        vcRef: ViewContainerRef
    ): ComponentRef<ControlArrayComponent<any, any>> {
        const arrComponent = arrayCfg.viewComponent || this.globalOptions?.arrayViewComponent;

        if(!arrComponent) throw Error("Missing control array component, Either specify in configuration or set a default component.")

        const componentRef = this.loadComponent(arrComponent, vcRef);

        componentRef.instance.viewOptionSelectors = arrayCfg.viewOptions;

        componentRef.instance.controlTemplate = arrayCfg.controlTemplate;

        componentRef.instance.formControl = formArray;

        return componentRef;   
    }

    private loadComponent<TComponent>(component: Type<TComponent>, vcRef: ViewContainerRef): ComponentRef<TComponent>{
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        return vcRef.createComponent<TComponent>(componentFactory);
    }

    private setClass(ref: ComponentRef<any>, controlClass?: string | Immutable<FormStateSelector<any, any, any, any, any>>): void {
        if(controlClass === undefined) return;
        const el = <HTMLElement> ref.location.nativeElement;    
        if(_isFormStateSelector(controlClass))
            this.resolver.resolve$(controlClass).pipe(
                startWith(undefined),
                pairwise<string | undefined>()
            ).subscribe(([prev, curr]) => {
                if(prev) this.renderer.removeClass(el, prev)
                if(curr) this.renderer.addClass(el, curr)
            }); 
        else 
            this.renderer.addClass(el, <string> controlClass)
    }

}