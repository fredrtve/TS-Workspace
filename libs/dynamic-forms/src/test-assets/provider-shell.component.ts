import { Component, ViewContainerRef } from "@angular/core";
import { ControlComponentRenderer } from "../lib/services/control-component.renderer";
import { ControlFactory } from "../lib/services/control.factory";
import { DynamicFormStore } from "../lib/services/dynamic-form.store";
import { FormStateResolver } from "../lib/services/form-state.resolver";

@Component({
    template: ``,
    providers: [DynamicFormStore, FormStateResolver, ControlFactory, ControlComponentRenderer]
})
export class ProviderShellComponent{ 
    constructor(
        public vcRef: ViewContainerRef, 
        public renderer: ControlComponentRenderer,
        public store: DynamicFormStore<any>,
        public resolver: FormStateResolver,
        public factory: ControlFactory
    ){} }
