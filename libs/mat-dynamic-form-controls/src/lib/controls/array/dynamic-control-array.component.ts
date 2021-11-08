import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { FormArray } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { AbstractDynamicControl, AllowFormStateSelectors, ControlArrayComponent, ControlFactory, DynamicFormsModule, FormStateResolver } from "dynamic-forms";
import { Immutable } from "global-types";
import { Observable } from "rxjs";
import { DynamicControlArrayEntryComponent } from "./dynamic-control-array-entry.component";

export interface DynamicControlArrayOptions { label$?: string }

@Component({    
    selector: 'lib-dynamic-control-array',
    templateUrl: 'dynamic-control-array.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicControlArrayComponent
    implements ControlArrayComponent<any, DynamicControlArrayOptions> {

    formControl: FormArray;
  
    viewOptionSelectors: Immutable<AllowFormStateSelectors<DynamicControlArrayOptions, any, any>>

    controlTemplate: Immutable<AbstractDynamicControl<any, any, any, any, any>>

    options$: Observable<Immutable<DynamicControlArrayOptions>>;

    ɵviewOptions?: DynamicControlArrayOptions

    constructor(
        private controlFactory: ControlFactory,
        private resolver: FormStateResolver
    ) { }

    ngOnInit(): void {
        this.options$ = this.resolver.resolveSlice$<DynamicControlArrayOptions>(this.viewOptionSelectors); 
    }

    addControl(){ 
        this.formControl.push(this.controlFactory.createControl(this.controlTemplate)); 
    }

    removeEntry(index: number){ this.formControl.removeAt(index); }
}
@NgModule({
    declarations:[       
        DynamicControlArrayComponent,
        DynamicControlArrayEntryComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatFormFieldModule,
        DynamicFormsModule
    ]
})
export class DynamicArrayModule {}