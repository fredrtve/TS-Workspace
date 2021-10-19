import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Immutable, Maybe } from "global-types";
import { DeepPartial } from "ts-essentials";
import { DynamicHostDirective } from "../dynamic-host.directive";
import { _mergeOverridesWithControls } from "../helpers/merge-group-options.helper";
import { DynamicForm } from "../interfaces";
import { ControlComponentRenderer } from "../services/control-component.renderer";
import { ControlFactory } from "../services/control.factory";
import { DynamicFormStore } from "../services/dynamic-form.store";
import { FormStateResolver } from "../services/form-state.resolver";

@Component({    
    selector: 'lib-dynamic-form',
    template: `
        <ng-container *dynamicHost>

        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DynamicFormStore, FormStateResolver, ControlFactory, ControlComponentRenderer]
})
export class DynamicFormComponent<TForm extends object, TInputState extends object> {
    @ViewChild(DynamicHostDirective, {static: true}) dynamicHost: DynamicHostDirective;

    @Input('inputState') 
    set inputState(value: Maybe<Immutable<TInputState>>) {
        if(value) this.formStore.setState(value)
    }

    private _config: DynamicForm<TForm, TInputState, any>;
    @Input('config') 
    set config(value: DynamicForm<TForm, TInputState, any>) {
        this._config = {...value, controls: _mergeOverridesWithControls(value.controls, value.overrides)}
    }

    @Input('formGroup') formGroup: FormGroup;

    @Input('initialValue') initialValue: Immutable<DeepPartial<TForm>>;

    constructor(
        private cdRef: ChangeDetectorRef,
        private controlFactory: ControlFactory,
        private controlRenderer: ControlComponentRenderer,
        private formStore: DynamicFormStore<TInputState>,
    ) { }

    ngOnInit(): void {
        this.controlFactory.createControlGroup(this._config, this.initialValue, this.formGroup);  
        this.formStore.form = this.formGroup;
        this.controlFactory.configureControlGroup(this._config, this.formGroup);
        this.controlRenderer.renderControls(this._config.controls, this.formGroup, this.dynamicHost.viewContainerRef)

        this.cdRef.markForCheck();
    }
}