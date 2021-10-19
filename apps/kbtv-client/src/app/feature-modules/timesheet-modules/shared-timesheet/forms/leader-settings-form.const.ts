import { LeaderSettings } from '@core/models/leader-settings.interface';
import { CheckboxControlComponent } from 'mat-dynamic-form-controls';
import { DynamicFormBuilder } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable } from 'global-types';

const builder = new DynamicFormBuilder<LeaderSettings>();

const LeaderSettingsForm = builder.form({
    controls: {
        confirmTimesheetsMonthly: builder.control({ 
            controlComponent: CheckboxControlComponent, 
            viewOptions: { text$: "Lås timer automatisk hver måned" }
        }),
    },
    overrides: {}
})

export const LeaderSettingsFormSheet: Immutable<FormSheetViewConfig<LeaderSettings>> = {
    formConfig: LeaderSettingsForm,
    navConfig: { title: "Innstillinger" },
    actionConfig: { submitText: "Lagre", onlineRequired: true },
    fullScreen: false
}
