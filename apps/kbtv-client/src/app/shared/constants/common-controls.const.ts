import { Validators } from '@angular/forms';
import { Employer, Mission, User } from '@core/models';
import { StateEmployers, StateMissions, StateUsers } from '@core/state/global-state.interfaces';
import { _compareProp } from '@shared-app/helpers/compare-with-prop.helper';
import { isObjectValidator } from '@shared/validators/is-object.validator';
import { DynamicControl, DynamicControlGroup, _formStateBinding } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { AutoCompleteQuestionComponent } from '../scam/dynamic-form-questions/auto-complete-question/auto-complete-question.component';
import { AutoCompleteQuestion } from '../scam/dynamic-form-questions/auto-complete-question/auto-complete-question.interface';
import { GooglePlacesAutoCompleteQuestion, GooglePlacesAutoCompleteQuestionComponent } from '../scam/dynamic-form-questions/google-places-autocomplete-question.component';
import { InputQuestion, InputQuestionComponent } from '../scam/dynamic-form-questions/input-question.component';
import { SelectQuestion, SelectQuestionComponent } from '../scam/dynamic-form-questions/select-question.component';
import { ValidationRules } from '../../shared-app/constants/validation-rules.const';
import { DateRange } from 'date-time-helpers';
import { IonDateQuestion, IonDateQuestionComponent } from '@shared/scam/dynamic-form-questions/ion-date-time-question.component';

export const PhoneNumberControl: Immutable<DynamicControl<string, null, InputQuestion>> = { 
    questionComponent: InputQuestionComponent,
    question: { placeholder: "Kontaktnummer" }, 
    validators: [
        Validators.minLength(ValidationRules.PhoneNumberMinLength), 
        Validators.maxLength(ValidationRules.PhoneNumberMaxLength)
    ] 
}
export const EmailControl: Immutable<DynamicControl<string, null, InputQuestion>> = { 
    questionComponent: InputQuestionComponent,
    question: { placeholder: "Epost" },  
    validators: [Validators.email] 
}
export const GoogleAddressControl: Immutable<DynamicControl<string, null, GooglePlacesAutoCompleteQuestion>> = {
    questionComponent: GooglePlacesAutoCompleteQuestionComponent,
    question: {
        placeholder: "Adresse", 
        hint: "F.eks. Furuberget 17, 1940 Bjørkelangen",
        resetable: true
    },  
    validators: [Validators.maxLength(ValidationRules.AddressMaxLength)] 
}
export const NameControl: Immutable<DynamicControl<string, null, InputQuestion>> = {
    questionComponent: InputQuestionComponent,
    question: { placeholder: "Navn"},  
    validators: [Validators.maxLength(ValidationRules.NameMaxLength)] 
}
export const FirstNameControl: Immutable<DynamicControl<string, null, InputQuestion>> = {
    questionComponent: InputQuestionComponent, question: { placeholder: "Fornavn" }, 
}
export const LastNameControl: Immutable<DynamicControl<string, null, InputQuestion>> = { 
    questionComponent: InputQuestionComponent, question: { placeholder: "Etternavn" }
}
export const MissionAutoCompleteControl: Immutable<DynamicControl<Mission, StateMissions, AutoCompleteQuestion<Mission, StateMissions>>> = {  
    questionComponent: AutoCompleteQuestionComponent,
    question: {
        placeholder: "Oppdrag",
        lazyOptions: "all",
        valueFormatter: (val) => val.address,
        displayWith: (mission) => mission?.address || "",
        resetable: true,
        activeFilter: { stringProps: ["address"], maxChecks: 50 },
        stateBindings: { 
            options: _formStateBinding<StateMissions, Mission[]>()( ["missions"] , (s) => s.missions || [] )
        }
    }, 
    validators: [isObjectValidator()], 
}
export const EmployerSelectControl: Immutable<DynamicControl<Employer, StateEmployers, SelectQuestion<Employer, StateEmployers>>> = { 
    questionComponent: SelectQuestionComponent,
    question: {
        valueFormatter: (val) => val.name,
        compareWith: _compareProp<Employer>("id"),
        lazyOptions: "all",
        placeholder: "Velg oppdragsgiver",
        stateBindings: { 
            options: _formStateBinding<StateEmployers, Employer[]>()( ["employers"] , (s) => s.employers || [] )
        }
    },  
}
export const UserSelectControl: Immutable<DynamicControl<User, StateUsers, SelectQuestion<User, StateUsers>>> = { 
    questionComponent: SelectQuestionComponent,
    question: {
        valueFormatter: (val) => val.firstName + ' ' + val.lastName,
        compareWith: _compareProp<User>("userName"),
        lazyOptions: "all",
        placeholder: "Velg ansatt",
        stateBindings: { 
            options: _formStateBinding<StateUsers, User[]>()( ["users"] , (s) => s.users || [] )
        }
    }, 
} 
export const UserNameControl: Immutable<DynamicControl<string, null, InputQuestion>> = { 
    question: {placeholder: "Brukernavn", autoComplete: "new-password"}, 
    questionComponent: InputQuestionComponent,
    validators: [
        Validators.pattern('^[a-zA-Z0-9_.-]*$'),
        Validators.minLength(4),
        Validators.maxLength(ValidationRules.NameMaxLength)
    ] 
}
export const NewPasswordControl: Immutable<DynamicControl<string, null, InputQuestion>> = { 
    required: true, questionComponent:  InputQuestionComponent,
    question: { 
        placeholder: "Nytt passord", type: "password", hideable: true, defaultHidden: true,
    },
    validators: [
        Validators.minLength(ValidationRules.UserPasswordMinLength),
        Validators.maxLength(ValidationRules.UserPasswordMaxLength)
    ] 
}
export const ConfirmPasswordControl: Immutable<DynamicControl<string, null, InputQuestion>> = { 
    required: true, questionComponent:  InputQuestionComponent,
    question: { 
        placeholder: "Gjenta nytt passord", type: "password", hideable: true, defaultHidden: true,
    }, 
}

export interface DateRangeControlGroupState { startMax: string, startMin: string, endMax: string, endMin: string }
export const DateRangeControlGroup: Immutable<DynamicControlGroup<DateRange, DateRangeControlGroupState>> = { 
    controls: {
        start: {
            questionComponent: IonDateQuestionComponent,
            question: <IonDateQuestion<DateRangeControlGroupState>>{
                placeholder: "Startdato", 
                width: "45%",
                ionFormat:"YYYY-MMMM-DD",
                datePipeFormat: "MMM d, y",
                stateBindings: {
                    min: _formStateBinding<DateRangeControlGroupState, string>()(["startMin"], (s) => s.startMin ),         
                    max: _formStateBinding<DateRangeControlGroupState, string>()(["startMax"], (s) => s.startMax )
                }              
            },  
        },
        end: {
            questionComponent: IonDateQuestionComponent,
            question: <IonDateQuestion<DateRangeControlGroupState>>{
                placeholder: "Sluttdato", 
                width: "45%",
                ionFormat:"YYYY-MMMM-DD",      
                datePipeFormat: "MMM d, y", 
                stateBindings: {
                    min: _formStateBinding<DateRangeControlGroupState, string>()(["endMin"], (s) => s.endMin ),         
                    max: _formStateBinding<DateRangeControlGroupState, string>()(["endMax"], (s) => s.endMax )
                }  
            },  
        },
    }
}