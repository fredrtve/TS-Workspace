import { Mission, MissionType } from 'src/app/core/models';
import { StateEmployers, StateMissions, StateMissionTypes } from 'src/app/core/services/state/interfaces';
import { DynamicControl, DynamicForm } from '../../dynamic-form/interfaces';
import { AutoCompleteQuestionComponent } from '../../dynamic-form/questions/auto-complete-question/auto-complete-question.component';
import { AutoCompleteQuestion } from '../../dynamic-form/questions/auto-complete-question/auto-complete-question.interface';
import { RadioGroupQuestion, RadioGroupQuestionComponent } from '../../dynamic-form/questions/radio-group-question.component';
import { SelectQuestion, SelectQuestionComponent } from '../../dynamic-form/questions/select-question.component';
import { _compareProp } from '../../form/helpers/compare-with-prop.helper';
import { OptionsFormState } from '../../form/options-form-state.interface';
import { MissionCriteria } from '../../interfaces';
import { EmployerSelectControl } from '../common-controls.const';

export interface MissionCriteriaFormState 
    extends OptionsFormState<StateMissions & StateEmployers & StateMissionTypes> {}

type FormState = MissionCriteriaFormState;

const SearchStringControl = <DynamicControl<MissionCriteria, FormState>>{ name: "searchString", 
    valueGetter: (s: MissionCriteria) => s.searchString,
    type: "control", questions: [{
        component:  AutoCompleteQuestionComponent,
        question: <AutoCompleteQuestion<Mission>>{
            optionsGetter: (s: FormState) => s.options.missions,
            valueFormatter: (val: Mission) => val.address,
            valueProp: "address",
            placeholder: "Søk med adresse",
            resetable: true,
            activeFilter: { stringProps: ["address"], maxChecks: 50 }
        }, 
    }], 
}
const MissionTypeControl = <DynamicControl<MissionCriteria, FormState>>{ name: "missionType",
    valueGetter: (s: MissionCriteria) => s.missionType,
    type: "control", questions: [{
        component:  SelectQuestionComponent,
        question: <SelectQuestion<MissionType>>{
            optionsGetter: (s: FormState) => s.options.missionTypes, 
            valueFormatter: (val: MissionType) => val.name,
            compareWith: _compareProp("id"),
            placeholder: "Velg oppdragstype",
        }, 
    }], 
}
const FinishedControl = <DynamicControl<MissionCriteria, FormState>>{ name: "finished",
    valueGetter: (s: MissionCriteria) => s.finished, 
    type: "control", questions: [{
        component:  RadioGroupQuestionComponent,
        question: <RadioGroupQuestion<boolean>>{   
            label: "Velg status", optionsGetter: [false, true],
            valueFormatter: (finished: boolean) => finished ? "Ferdig" : "Aktiv"
        }, 
    }], 
}

export const MissionCriteriaForm: DynamicForm<MissionCriteria, FormState> = {
    submitText: "Bruk", resettable: true, resetState: {finished: false},
    controls: [
        SearchStringControl,
        {...EmployerSelectControl, required: true},
        MissionTypeControl,
        FinishedControl
    ],
}