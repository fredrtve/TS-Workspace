import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Optional, Renderer2, Type, ViewContainerRef } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Immutable, Maybe } from "global-types";
import { pairwise, startWith } from "rxjs/operators";
import { DYNAMIC_FORM_DEFAULT_OPTIONS } from "../injection-tokens.const";
import { AllowFormStateSelectors, ControlArrayComponent, ControlFieldComponent, ControlGroupComponent, DynamicControlField, DynamicControlArray, DynamicControlGroup, DynamicControlFieldOptions, DynamicFormDefaultOptions, FormStateSelector, GenericAbstractControl, ValidControl, ValidControlObject, FormControlType } from "../interfaces";
import { _isControlArray, _isControlGroup, _isFormStateSelector } from "../helpers/type.helpers";
import { FormStateResolver } from "./form-state.resolver";

type ControlWithSelectors<T extends DynamicControlField<any, ControlFieldComponent<any, any>> = DynamicControlField<any, ControlFieldComponent<any, any>>> = 
    Omit<T, keyof DynamicControlFieldOptions> & AllowFormStateSelectors<DynamicControlFieldOptions,any, ControlFieldComponent<any, any>>
  
type ValidFormComponent<T extends ValidControl<any>> = T extends DynamicControlField<any,(infer Q)> ? ControlFieldComponent<any, Q> : ControlGroupComponent<any>

@Injectable()
export class ControlComponentRenderer {
 
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,       
        @Inject(DYNAMIC_FORM_DEFAULT_OPTIONS) @Optional() private globalOptions: Maybe<DynamicFormDefaultOptions>,
        private resolver: FormStateResolver,
        private renderer: Renderer2,
    ) { }

    renderControls(controls: ValidControlObject<any>, formGroup: FormGroup, vcRef: ViewContainerRef): void {
        for(const controlName in controls){
            const formControl = formGroup.get(controlName);
            if(formControl === null) throw Error(`No form control for control with name ${controlName} on group ${formGroup}`)
             const ref = this.renderControl(controls[controlName], <FormControlType<any>> formControl, vcRef);
             if(ref) this.renderer.setAttribute(ref.location.nativeElement, "data-cy", "form-"+controlName)
             ref?.instance.onControlInit?.();
        }
    }

    renderControl<C extends ValidControl<any>>(controlCfg: Immutable<C>, control: FormControlType<C>, vcRef: ViewContainerRef): ComponentRef<ValidFormComponent<C>> | undefined {

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
            ref = this.loadField(<ControlWithSelectors> controlCfg, <FormControl><unknown> control, vcRef); 
            if(ref === undefined) return; 
            this.setClass(ref, this.globalOptions?.fieldClass)
        }

        this.setClass(ref, controlCfg.controlClass$)
        
        return <ComponentRef<ValidFormComponent<C>>> ref;

    }

    private loadField(
        controlCfg: ControlWithSelectors,
        control: FormControl, 
        vcRef: ViewContainerRef
    ): ComponentRef<ControlFieldComponent<object | null, object>> | undefined {
        if(!controlCfg.viewComponent) return;
        
        const componentRef = this.loadComponent(controlCfg.viewComponent, vcRef);

        componentRef.instance.control = control;

        componentRef.instance.viewOptionSelectors = controlCfg.viewOptions || {};

        componentRef.instance.requiredSelector = controlCfg.required$;

        return componentRef;
    }

    private loadGroup(groupCfg: Immutable<DynamicControlGroup<any, any, any>>, formGroup: FormGroup, vcRef: ViewContainerRef): ComponentRef<ControlGroupComponent<any>> {
        const viewComponent = groupCfg.viewComponent || this.globalOptions?.groupViewComponent;

        if(!viewComponent) throw Error("Missing control group component, Either specify in configuration or set a default component.")

        const componentRef = this.loadComponent(viewComponent, vcRef);

        componentRef.instance.config = groupCfg;

        componentRef.instance.formGroup = formGroup;

        return componentRef;   
    }

    private loadArray(arrayCfg: Immutable<DynamicControlArray<any, any>>, formArray: FormArray, vcRef: ViewContainerRef): ComponentRef<ControlArrayComponent<any>> {
        const arrComponent = arrayCfg.viewComponent || this.globalOptions?.arrayViewComponent;

        if(!arrComponent) throw Error("Missing control array component, Either specify in configuration or set a default component.")

        const componentRef = this.loadComponent(arrComponent, vcRef);

        componentRef.instance.config = arrayCfg;

        componentRef.instance.formArray = formArray;

        return componentRef;   
    }

    private loadComponent<TComponent>(component: Type<TComponent>, vcRef: ViewContainerRef): ComponentRef<TComponent>{
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        return vcRef.createComponent<TComponent>(componentFactory);
    }

    private setClass(ref: ComponentRef<any>, controlClass?: string | Immutable<FormStateSelector<any, any, string | undefined, any, any>>): void {
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