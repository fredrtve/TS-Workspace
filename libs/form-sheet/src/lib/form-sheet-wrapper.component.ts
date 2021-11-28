import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Inject, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DynamicHostDirective } from '@fretve/dynamic-forms';
import { isObservable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { FormCanceledByUserEvent } from './form-canceled-by-user-event.const';
import { FormSheetComponent } from './form-sheet/form-sheet.component';
import { FormSheetWrapperConfig } from './interfaces';

/** Component responsible for rendering a form component in a material bottom sheet.
 *  Also renders the top navigation bar */
@Component({
    selector: 'lib-form-sheet-wrapper',
    template: `
        <lib-form-sheet-nav-bar 
            [config]="config.navConfig" 
            (close)="onCancel()">
        </lib-form-sheet-nav-bar>
        <div class="form-sheet-loading" style="text-align:center; margin-top: 24px">
            Laster inn skjema...
        </div>
    `,
    styleUrls: ['./form-sheet-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSheetWrapperComponent  {

    private formStateSub: Subscription

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<FormSheetWrapperComponent, unknown>, 
        private _renderer: Renderer2,
        private _cfr: ComponentFactoryResolver,
        private _vcr: ViewContainerRef,
        @Inject(MAT_BOTTOM_SHEET_DATA) public config: FormSheetWrapperConfig<object, object>) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.removeLoader()
            this.loadForm()
        }) 
    }

    onCancel(){ this.close(FormCanceledByUserEvent) }

    onSubmit(res: object | typeof FormCanceledByUserEvent) {
        if(typeof res !== "string" && this.config.submitCallback) this.config.submitCallback(res);
        this.close(res || FormCanceledByUserEvent)
    }

    ngOnDestroy(){
        this.formStateSub?.unsubscribe();
    }

    private close = (res: unknown): void => this._bottomSheetRef.dismiss(res);

    private loadForm(){
        const factory = this._cfr.resolveComponentFactory(FormSheetComponent);
        let formRef = this._vcr.createComponent(factory);

        formRef.instance.initialValue = this.config.initialValue || {};  
        formRef.instance.formConfig = this.config.formConfig;  
        formRef.instance.actionConfig = this.config.actionConfig;  
        formRef.instance.formClass = this.config.formClass;  

        if(isObservable(this.config.formState))
            this.formStateSub = 
                this.config.formState.subscribe(x => formRef.instance.inputState = x);
        else 
            formRef.instance.inputState = this.config.formState || {};

        formRef.instance.formSubmit.pipe(first()).subscribe(x => this.onSubmit(x))
    }

    private removeLoader(): void {
        const el = (<HTMLElement> this._vcr.element.nativeElement).getElementsByClassName('form-sheet-loading')[0];
        if(el) this._renderer.removeChild(this._vcr.element.nativeElement, el);   
    }
     
}
