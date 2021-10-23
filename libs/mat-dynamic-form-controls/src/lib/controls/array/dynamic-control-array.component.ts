import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { FormArray } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { AllowFormStateSelectors, ControlArrayComponent, ControlFactory, DynamicControlArray, DynamicFormsModule, FormStateResolver, ValidControl } from "dynamic-forms";
import { Observable } from "rxjs";
import { DynamicControlArrayEntryComponent } from "./dynamic-control-array-entry.component";

export interface DynamicControlArrayOptions { label$?: string }

@Component({    
    selector: 'lib-dynamic-control-array',
    templateUrl: 'dynamic-control-array.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicControlArrayComponent
    implements ControlArrayComponent<DynamicControlArrayOptions> {

    formArray: FormArray;
  
    viewOptionSelectors: AllowFormStateSelectors<DynamicControlArrayOptions, any, any>

    controlTemplate: ValidControl<any>

    options$: Observable<DynamicControlArrayOptions>;

    constructor(
        private controlFactory: ControlFactory,
        private resolver: FormStateResolver
    ) { }

    ngOnInit(): void {
        this.options$ = this.resolver.resolveSlice$<DynamicControlArrayOptions>(this.viewOptionSelectors); 
    }

    addControl(){ 
        this.formArray.push(this.controlFactory.createControl(this.controlTemplate)); 
    }

    removeEntry(index: number){ this.formArray.removeAt(index); }
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
class DynamicArrayModule {}