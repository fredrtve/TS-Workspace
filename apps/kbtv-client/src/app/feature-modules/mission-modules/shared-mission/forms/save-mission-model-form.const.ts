import { Validators } from '@angular/forms';
import { Employer, Mission, MissionType } from '@core/models';
import { StateEmployers, StateMissionTypes } from '@core/state/global-state.interfaces';
import { ModelState } from '@core/state/model-state.interface';
import { _googleAddressFormatter } from '@shared-app/helpers/google-address-formatter.helper';
import { _missionFormToSaveModelConverter } from '@shared-mission/forms/mission-form-to-save-model.converter';
import { GoogleAddressControl, PhoneNumberControl } from '@shared/constants/common-controls.const';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { AutoCompleteQuestionComponent } from '@shared/scam/dynamic-form-questions/auto-complete-question/auto-complete-question.component';
import { AutoCompleteQuestion } from '@shared/scam/dynamic-form-questions/auto-complete-question/auto-complete-question.interface';
import { CheckboxQuestion, CheckboxQuestionComponent } from '@shared/scam/dynamic-form-questions/checkbox-question.component';
import { TextAreaQuestion, TextAreaQuestionComponent } from '@shared/scam/dynamic-form-questions/text-area-question.component';
import { DynamicControl, _formStateBinding } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { Converter, ModelFormConfig } from 'model/form';

export interface CreateMissionForm extends Pick<Mission, "address" | "phoneNumber" | "description"> {
    employerName?: string,
    missionTypeName?: string
}

export interface UpdateMissionForm extends CreateMissionForm, Pick<Mission, "id" | "finished"> {}

type FormState = StateEmployers & StateMissionTypes;

const DescriptionControl: Immutable<DynamicControl<string, FormState, TextAreaQuestion>> = { 
    questionComponent: TextAreaQuestionComponent,
    question: { placeholder: "Beskrivelse", rows: 1 }, 
    validators: [Validators.maxLength(ValidationRules.MissionDescriptionMaxLength)] 
}

const EmployerControl: Immutable<DynamicControl<string, FormState, AutoCompleteQuestion<Employer, FormState>>> = { 
    questionComponent: AutoCompleteQuestionComponent,
    question: {
        placeholder: "Oppdragsgiver",
        valueProp: "name",
        lazyOptions: "all",
        hint: "Lag ny eller velg eksisterende oppdragsgiver",
        valueFormatter: (val) => val.name, 
        resetable: true,
        activeFilter: { 
            criteriaFormatter: (s) => s?.toLowerCase(), 
            filter: (e, s) => e.name.toLowerCase().indexOf(s) !== -1 
        },
        stateBindings:{ options: _formStateBinding<FormState, Employer[]>()(["employers"], s => s.employers || []) }
    },  
}

const MissionTypeControl: Immutable<DynamicControl<string, FormState, AutoCompleteQuestion<MissionType, FormState>>> = { 
    questionComponent: AutoCompleteQuestionComponent,
    question: {
        placeholder: "Oppdragstype",
        valueProp: "name",
        lazyOptions: "all",
        hint: "Lag ny eller velg eksisterende oppdragstype",
        valueFormatter: (val) => val.name, 
        resetable: true,
        activeFilter: { 
            criteriaFormatter: (s) => s?.toLowerCase(),
            filter: (e, s) => e.name.toLowerCase().indexOf(s) !== -1 ,
        },
        stateBindings: { options: _formStateBinding<FormState, MissionType[]>()(["missionTypes"], s => s.missionTypes || []) }
    } 
}

const FinishedControl: Immutable<DynamicControl<boolean, FormState, CheckboxQuestion>> = { 
    questionComponent: CheckboxQuestionComponent,
    question: { text: "Er oppdraget ferdig?" }, 
}

const _missionToMissionFormConverter: Converter<Mission, CreateMissionForm> = ({missionType, employer, ...rest}) => { 
    return {...rest, employerName: employer?.name, missionTypeName: missionType?.name }
}

export const CreateMissionModelForm: Immutable<ModelFormConfig<ModelState, Mission, CreateMissionForm, FormState>> = {
    includes: {prop: "missions", includes: ["employer", "missionType"]},
    actionConverter: _missionFormToSaveModelConverter,
    modelConverter: _missionToMissionFormConverter,
    dynamicForm: {
        submitText: "Legg til",
        controls: {
            address: {...GoogleAddressControl, required: true},
            phoneNumber: PhoneNumberControl,
            description: DescriptionControl,
            employerName: EmployerControl,
            missionTypeName: MissionTypeControl,    
        },
        onSubmitFormatter: _googleAddressFormatter
    }
}

export const EditMissionModelForm: Immutable<ModelFormConfig<ModelState, Mission, UpdateMissionForm, FormState>> = {
    includes: {prop: "missions", includes: ["employer", "missionType"]},
    actionConverter: _missionFormToSaveModelConverter,
    modelConverter: _missionToMissionFormConverter,
    dynamicForm: {
        submitText: "Oppdater",
        controls: {
            address: {...GoogleAddressControl, required: true},
            phoneNumber: PhoneNumberControl,
            description: DescriptionControl,
            employerName: EmployerControl,
            missionTypeName: MissionTypeControl,   
            finished: FinishedControl,
            id: { required: true, questionComponent: null }, 
        },
        onSubmitFormatter: _googleAddressFormatter
    }
}