import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Immutable, Maybe } from "global-types";
import { DeepPartial } from "ts-essentials";
import { ControlGroupSchema, ValidControlSchemaMap } from "./builder/interfaces";
import { _mergeOverridesWithControls } from "./builder/merge-overrides-with-controls.helper";
import { DynamicHostDirective } from "./dynamic-host.directive";
import { DynamicControlGroup } from "./interfaces";
import { ControlComponentRenderer } from "./services/control-component.renderer";
import { ControlFactory } from "./services/control.factory";
import { DynamicFormStore } from "./services/dynamic-form.store";
import { FormStateResolver } from "./services/form-state.resolver";

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
    @ViewChild(DynamicHostDirective, {static: true}) dynamicHost?: DynamicHostDirective;

    @Input('inputState') 
    set inputState(value: Maybe<Immutable<TInputState>>) {
        if(value) this.formStore.setState(value)
    }

    private _config?: Immutable<DynamicControlGroup<TForm, TInputState, TForm, any, any>>;
    @Input('config') 
    set config(value: Immutable<ControlGroupSchema<TForm, TInputState, ValidControlSchemaMap<TForm, any>,any>>) {
        this._config = {...value, viewOptions: {}, controls: _mergeOverridesWithControls(value.controls, value.overrides)}
    }

    @Input() formGroup: FormGroup = new FormGroup({});

    @Input() initialValue: Immutable<DeepPartial<TForm>> = <Immutable<DeepPartial<TForm>>> {};

    constructor(
        private cdRef: ChangeDetectorRef,
        private controlFactory: ControlFactory,
        private controlRenderer: ControlComponentRenderer,
        private formStore: DynamicFormStore<TInputState>
    ) { }

    ngOnInit(): void {
        this.controlFactory.createControl(this._config!, this.initialValue, <any> this.formGroup);  
        this.formStore.form = this.formGroup;
        this.controlFactory.configureControl(this._config!, <any> this.formGroup);
        this.controlRenderer.renderControl<DynamicControlGroup<TForm, TInputState, TForm, any, any>>(
            this._config!, this.formGroup, this.dynamicHost!.viewContainerRef
        )

        this.cdRef.markForCheck();
    }
}