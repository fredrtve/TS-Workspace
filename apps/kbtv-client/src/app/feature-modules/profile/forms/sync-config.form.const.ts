import { Validators } from '@angular/forms';
import { DefaultState } from '@core/configurations/default-state.const';
import { IonDateQuestion, IonDateQuestionComponent } from '@shared/scam/dynamic-form-questions/ion-date-time-question.component';
import { SliderQuestion, SliderQuestionComponent } from '@shared/scam/dynamic-form-questions/slider-question.component';
import { _getISO } from 'date-time-helpers';
import { DynamicForm } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable } from 'global-types';
import { SyncConfig } from 'state-sync';

export interface SyncConfigForm extends Pick<SyncConfig, "refreshTime"> {
    initialMonthISO: string
}

export const SyncConfigForm: Immutable<DynamicForm<SyncConfigForm, null>> = {
    submitText: "Lagre", 
    resettable: true, 
    resetState: {...DefaultState.syncConfig, refreshTime: DefaultState.syncConfig.refreshTime / 60}, 
    controls: {
        refreshTime: { required: true,
            questionComponent:  SliderQuestionComponent,
            question: <SliderQuestion>{
                label: "Synkroniseringstid",
                hint: "Hvor ofte skal det sjekkes etter oppdatert data?",
                valueSuffix: "min", 
                min: 3, max: 60, tickInterval: 5, thumbLabel: true
            }, 
            validators: [Validators.min(1)] 
        },
        initialMonthISO: { required: true, 
            questionComponent:  IonDateQuestionComponent,
            question: <IonDateQuestion<SyncConfig>>{
                 placeholder: "Synkroniseringsdato", 
                 hint: "Hvor gammel data skal lastes inn? Kun data opprettet eller oppdatert etter gitt dato lastes inn.",
                 ionFormat:"YYYY-MMMM",
                 datePipeFormat: "MMMM, y",
                 stateBindings: {
                    max: _getISO(new Date())
                 }
            }, 
        } ,
    },
}

export const SyncConfigFormSheet: Immutable<FormSheetViewConfig<SyncConfigForm>> = {
    formConfig: SyncConfigForm, 
    navConfig: {title: "Konfigurasjoner"},
    fullScreen: false,
  }