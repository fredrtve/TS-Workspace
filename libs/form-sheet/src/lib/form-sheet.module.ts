import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DynamicFormsModule } from "@fretve/dynamic-forms";
import { FormActionsComponent } from "./form-actions/form-actions.component";
import { FormSheetNavBarComponent } from "./form-sheet-nav-bar/form-sheet-nav-bar.component";
import { FormSheetWrapperComponent } from "./form-sheet-wrapper.component";
import { FormSheetComponent } from "./form-sheet/form-sheet.component";

/** Responisble for declaring components. */
@NgModule({
    declarations: [
        FormSheetWrapperComponent,
        FormSheetNavBarComponent,
        FormActionsComponent,
        FormSheetComponent,
    ],
    imports: [
        CommonModule,
        MatBottomSheetModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        DynamicFormsModule,
    ]
})
export class FormSheetModule {}
  