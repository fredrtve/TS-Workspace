import { Validators } from '@angular/forms';
import { DefaultState } from '@core/configurations/default-state.const';
import { SliderFieldComponent } from 'mat-dynamic-form-controls';
import { _getISO } from 'date-time-helpers';
import { DynamicFormBuilder } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable } from 'global-types';
import { SyncConfig } from 'state-sync';
import { IonDateControlComponent } from '@shared/scam/dynamic-form-controls/ion-date-time-control.component';

export interface SyncConfigForm extends Pick<SyncConfig, "refreshTime"> {
    initialMonthISO: string
}

const builder = new DynamicFormBuilder<SyncConfigForm>();

const SyncConfigForm = builder.form({
    controls: {
        refreshTime: builder.field({
            viewComponent:  SliderFieldComponent, required$: true,
            viewOptions: {
                label$: "Synkroniseringstid",
                hint$: "Hvor ofte skal det sjekkes etter oppdatert data?",
                valueSuffix$: "min", 
                min$: 3, max$: 60, tickInterval$: 5, thumbLabel$: true
            }, 
            validators$: [Validators.min(1)] 
        }),
        initialMonthISO: builder.field<IonDateControlComponent>({
            viewComponent:  IonDateControlComponent, required$: true,
            viewOptions: {
                 placeholder$: "Synkroniseringsdato", 
                 hint$: "Hvor gammel data skal lastes inn? Kun data opprettet eller oppdatert etter gitt dato lastes inn.",
                 ionFormat$:"YYYY-MMMM",
                 datePipeFormat$: "MMMM, y",
                 max$: _getISO(new Date())
            },
        }),
    },
    overrides: {}
});

export const SyncConfigFormSheet: Immutable<FormSheetViewConfig<SyncConfigForm>> = {
    formConfig: SyncConfigForm, 
    navConfig: {title: "Konfigurasjoner"},
    actionConfig:{
        submitText: "Lagre", 
        resettable: true, 
        resetState: { 
            initialMonthISO: _getISO(DefaultState.syncConfig.initialTimestamp), 
            refreshTime: DefaultState.syncConfig.refreshTime / 60 
        }, 
    },
    fullScreen: false,
  }