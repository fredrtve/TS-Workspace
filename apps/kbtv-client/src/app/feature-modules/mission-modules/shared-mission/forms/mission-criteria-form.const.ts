import { Mission, MissionType } from '@core/models';
import { StateEmployers, StateMissions, StateMissionTypes } from '@core/state/global-state.interfaces';
import { _compareProp } from '@shared-app/helpers/compare-with-prop.helper';
import { DateRangeControlGroup, DateRangeControlGroupState, EmployerSelectControl } from '@shared/constants/common-controls.const';
import { SyncModelDateRangeFormStateSetters } from '@shared/constants/common-form-state-setters.const';
import { MissionCriteria } from '@shared/interfaces';
import { AutoCompleteQuestionComponent } from '@shared/scam/dynamic-form-questions/auto-complete-question/auto-complete-question.component';
import { AutoCompleteQuestion } from '@shared/scam/dynamic-form-questions/auto-complete-question/auto-complete-question.interface';
import { RadioGroupQuestion, RadioGroupQuestionComponent } from '@shared/scam/dynamic-form-questions/radio-group-question.component';
import { SelectQuestion, SelectQuestionComponent } from '@shared/scam/dynamic-form-questions/select-question.component';
import { DynamicControl, DynamicForm, _formStateBinding } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';
import { Immutable, NotNull } from 'global-types';
import { StateSyncConfig } from 'state-sync';

export type MissionCriteriaFormState = StateMissions & StateEmployers & 
    StateMissionTypes & StateSyncConfig & DateRangeControlGroupState

export interface MissionCriteriaForm extends NotNull<MissionCriteria> {}

type FormState = MissionCriteriaFormState;

const SearchStringControl: Immutable<DynamicControl<string, FormState, AutoCompleteQuestion<Mission, FormState>>> = { 
    questionComponent:  AutoCompleteQuestionComponent,
    question: {
        valueFormatter: (val) => val.address,
        valueProp: "address",
        lazyOptions: "all",
        placeholder: "Søk med adresse",
        resetable: true,
        activeFilter: { 
            criteriaFormatter: (s) => s?.toLowerCase(), 
            filter: (e, s) => e.address!.toLowerCase().indexOf(s) !== -1, 
            maxChecks: 50 
        },
        stateBindings: {
            options: _formStateBinding<FormState, Mission[]>()(["missions"], (s) => s.missions || [])
        }
    }, 
}
const MissionTypeControl: Immutable<DynamicControl<MissionType, FormState, SelectQuestion<MissionType, FormState>>> = { 
    questionComponent:  SelectQuestionComponent,
    question: {
        valueFormatter: (val) => val.name,
        compareWith: _compareProp<MissionType>("id"),
        lazyOptions: "all",
        placeholder: "Velg oppdragstype",
        stateBindings: {
            options: _formStateBinding<FormState, MissionType[]>()(["missionTypes"], (s) => s.missionTypes || [])
        }
    }, 
}
const FinishedControl: Immutable<DynamicControl<boolean, FormState, RadioGroupQuestion<boolean, null>>> = { 
    questionComponent:  RadioGroupQuestionComponent,
    question: {   
        label: "Velg status",
        valueFormatter: (finished) => finished ? "Ferdig" : "Aktiv",
        stateBindings: { options: [false, true] }
    }, 
}

export const MissionCriteriaForm: Immutable<DynamicForm<MissionCriteriaForm, FormState>> = {
    submitText: "Bruk", 
    resettable: true, resetState: {finished: false},
    controls: {
        searchString: SearchStringControl,
        employer: EmployerSelectControl,
        missionType: MissionTypeControl,
        dateRange: {...DateRangeControlGroup, panelClass: "mission-date-range-question-group"},
        finished: FinishedControl,
    },
    formStateSetters: SyncModelDateRangeFormStateSetters
}

export const MissionCriteriaFormSheet: Immutable<FormSheetViewConfig<MissionCriteriaForm, FormState>> = {
    formConfig: MissionCriteriaForm, 
    navConfig: {title: "Velg filtre"},
}