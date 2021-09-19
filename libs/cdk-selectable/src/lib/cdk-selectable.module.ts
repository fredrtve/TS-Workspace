import { NgModule } from "@angular/core";
import { CdkSelectableContainerDirective } from "./cdk-selectable-container.directive";

/** Responsible for exporting the {@link CdkSelectableContainerDirective} */
@NgModule({
    declarations: [CdkSelectableContainerDirective],
    imports: [],
    exports: [CdkSelectableContainerDirective]
})
export class CdkSelectableModule { }
  