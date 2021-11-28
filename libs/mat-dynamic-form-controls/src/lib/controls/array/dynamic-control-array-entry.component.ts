import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Type, ViewChild } from "@angular/core";
import { AbstractDynamicControl, ControlArrayEntryProviders, ControlComponent, ControlComponentRenderer, ControlFactory, DynamicHostDirective, FormControlType, _addIndexesToTemplate } from "@fretve/dynamic-forms";
import { Immutable, Maybe } from "@fretve/global-types";

@Component({    
    selector: 'lib-dynamic-control-array-entry',
    template: `
        <style>
            :host{
                display: flex;
                align-items: center;
                justify-content: start;
            }
        </style>
        <ng-container *dynamicHost>

        </ng-container>
        <button mat-icon-button (click)="removeEntry()" type="button" color="warn">
            <mat-icon>delete_forever</mat-icon>
        </button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: ControlArrayEntryProviders
})
export class DynamicControlArrayEntryComponent {

    @ViewChild(DynamicHostDirective, {static: true}) dynamicHost: DynamicHostDirective;

    @Output() entryRemoved = new EventEmitter<any>();
  
    @Input() control: FormControlType<AbstractDynamicControl<any, any, any, any, any>>;
  
    @Input() config: Immutable<AbstractDynamicControl<any, any, any, Maybe<Type<ControlComponent<any, any>>>, any>>;

    @Input() index: number;

    constructor(
        private controlFactory: ControlFactory,
        private controlRenderer: ControlComponentRenderer
    ) { }

    ngOnInit(): void {
        const controlCfg = _addIndexesToTemplate(this.config, this.index);
        this.controlFactory.configureControl(controlCfg, this.control)
        const ref = this.controlRenderer.renderControl(controlCfg, this.control, this.dynamicHost.viewContainerRef);
        ref?.instance.onControlInit?.();
    }

    removeEntry(){ this.entryRemoved.emit(); }
}