import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Directive, Type } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { Immutable, Prop, UnknownState, ValueOf } from 'global-types';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DynamicFormFactory } from '../dynamic-form.factory';
import { DynamicHostDirective } from '../dynamic-host.directive';
import { DynamicAbstractGroup, DynamicControl, DynamicControlGroup, DynamicFormOptions, QuestionComponent, ValidControl } from '../interfaces';
import { _isControlGroup } from '../type.helpers';

@Directive()
export abstract class DynamicAbstractGroupComponent<
    TGroupConfig extends DynamicAbstractGroup<object, object | null> = DynamicAbstractGroup<object, object | null>> {

    dynamicHost: DynamicHostDirective;

    unsubscribe : Subject<void> = new Subject();

    formGroup: FormGroup;

    formOptions: Immutable<DynamicFormOptions>;

    get config(): Immutable<TGroupConfig> { return this._config }

    set config(value: Immutable<TGroupConfig>) {
      this._config = value;
    }

    protected _config: Immutable<TGroupConfig>;
    
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,  
        protected cdRef: ChangeDetectorRef,      
        private defaultControlGroupComponent: Type<DynamicAbstractGroupComponent>,
        private dynamicFormFactory: DynamicFormFactory
    ) { }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    initalize(): void {
        this.dynamicHost.viewContainerRef.clear(); 
        
        if(this.config.validators) 
            this.formGroup.setValidators(<ValidatorFn[]> this.config.validators)

        for(const controlName in this.config.controls){
            const control = <ValidControl<object>> (<UnknownState> this.config.controls)[controlName];

            const componentRef = _isControlGroup(control) ? 
                this.initalizeGroup(control, controlName) :
                this.initalizeControl(control, controlName);  

            if(componentRef === undefined) continue;

            const hideOnValueChanges = <(val: any) => boolean> (<UnknownState>this.config.hideOnValueChangeMap)?.[controlName];

            if(hideOnValueChanges)
                this.initHideObserver(hideOnValueChanges, componentRef.location.nativeElement);    
        }
    }

    private initalizeControl<TForm>(controlCfg: Immutable<DynamicControl<ValueOf<TForm>>>, controlName: Prop<TForm>): ComponentRef<QuestionComponent<object | null>> | undefined {
        const disabledControls = this.config.disabledControls;

        const control = this.dynamicFormFactory.createControl(
            controlCfg, 
            disabledControls ? <boolean>(<UnknownState>disabledControls)[<string>controlName] : false)
            
        this.formGroup.addControl(controlName, control)

        if((this.formOptions.noRenderDisabledControls && control.disabled) || !controlCfg.questionComponent) return;
        
        const componentRef = this.loadComponent(controlCfg.questionComponent);

        componentRef.instance.control = control;
        componentRef.instance.question = <any> controlCfg.question || {};  
        componentRef.instance.required = controlCfg.required;  
        componentRef.location.nativeElement.style.marginTop = "3vh";

        componentRef.location.nativeElement.setAttribute('data-cy', 'form-' + controlName);

        if(controlCfg.panelClass)
            componentRef.location.nativeElement.classList.add(controlCfg.panelClass)   

        return componentRef;
    }

    private initalizeGroup<TForm>(groupCfg: Immutable<DynamicControlGroup<any, any>>, controlName: Prop<TForm>): ComponentRef<DynamicAbstractGroupComponent> {
        const formGroup = new FormGroup({});

        this.formGroup.addControl(controlName, formGroup)

        const componentRef = this.loadComponent(groupCfg.controlGroupComponent || this.defaultControlGroupComponent);

        componentRef.instance.config = groupCfg;
        componentRef.instance.formGroup = formGroup;
        componentRef.instance.formOptions = this.formOptions;
        componentRef.location.nativeElement.classList.add('form-' + controlName);
        
        if(groupCfg.panelClass) 
            componentRef.location.nativeElement.classList.add(groupCfg.panelClass)

        componentRef.instance.initalize(); 

        return componentRef;   
    }

    private loadComponent<TComponent>(component: Type<TComponent>): ComponentRef<TComponent>{
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

        const viewContainerRef = this.dynamicHost.viewContainerRef;

        return viewContainerRef.createComponent<TComponent>(componentFactory);
    }

    private initHideObserver(hideOnValueChanges: (val: any) => boolean, htmlElement: HTMLElement): void{   
        const currentDisplayVal = htmlElement.style.display;

        if(hideOnValueChanges(this.formGroup.value)) htmlElement.style.display = "none";
        
        this.formGroup.valueChanges.pipe(
            map(hideOnValueChanges), 
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            htmlElement.style.display = (x ? "none" : currentDisplayVal);
            this.cdRef.detectChanges();
        })
    }

}