import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Inject, Renderer2, ViewContainerRef } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UnknownState } from 'global-types';
import { Subscription } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { FormSheetNavBarComponent } from './form-sheet-nav-bar/form-sheet-nav-bar.component';
import { FormSheetWrapperConfig } from './interfaces';
import { SheetClosedByUserEvent } from './sheet-closed-by-user-event.const';

/** Component responsible for rendering a form component in a material bottom sheet.
 *  Also renders the top navigation bar */
@Component({
    selector: 'lib-form-sheet-wrapper',
    template: ``,
    styleUrls: ['./form-sheet-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSheetWrapperComponent  {
    
    private formStateSub: Subscription;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private _bottomSheetRef: MatBottomSheetRef<FormSheetWrapperComponent, unknown>, 
        private renderer: Renderer2,
        @Inject(MAT_BOTTOM_SHEET_DATA) private config: FormSheetWrapperConfig<object, object, UnknownState, unknown>) { }
    
    ngOnInit() {
        this.loadNav();
        this.loadLoader();

        setTimeout(() => {
            this.removeLoader();
            this.loadForm();
        })
    }
        
    ngOnDestroy(){
        this.formStateSub?.unsubscribe();
    }

    private close = (res: unknown): void => this._bottomSheetRef.dismiss(res);
        
    private loadNav(){
        const factory = this.componentFactoryResolver.resolveComponentFactory(FormSheetNavBarComponent);
        let navRef = this.viewContainerRef.createComponent(factory);
        navRef.instance.config = this.config.navConfig;
        navRef.instance.closed.pipe(first()).subscribe(x => this.close(SheetClosedByUserEvent));
    }
    
    private loadForm(){
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.config.formComponent);
        let formRef = this.viewContainerRef.createComponent(factory);
        formRef.instance.config = this.config.formConfig;  
        formRef.instance.initialValue = this.config.initialValue || {};  

        if(this.config.formState$)
            this.formStateSub = 
                this.config.formState$.subscribe(x => formRef.instance.inputState = x)

        formRef.instance.formSubmitted.pipe(first(),
            tap(x => (x && this.config.submitCallback) ? this.config.submitCallback(x) : null),
        ).subscribe(x => this.close(x || SheetClosedByUserEvent))
    }

    private loadLoader(): void{
        var div = this.renderer.createElement("div");
        this.renderer.setProperty(div, "innerHTML", "Laster inn skjema...");
        this.renderer.addClass(div, "loading");
        this.renderer.appendChild(this.getParentElement(), div)
    }

    private removeLoader(): void {
        const el = this.getParentElement()?.getElementsByClassName('loading')[0];
        if(el) this.renderer.removeChild(this.getParentElement(), el);
       
    }

    private getParentElement = (): HTMLElement | null => 
        (<HTMLElement> this.viewContainerRef.element.nativeElement).parentElement
        
}
