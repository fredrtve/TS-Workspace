import { Validators } from '@angular/forms';
import { MissionNote } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { DynamicControl } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';
import { InputQuestion, InputQuestionComponent } from '../../scam/dynamic-form-questions/input-question.component';
import { TextAreaQuestion, TextAreaQuestionComponent } from '../../scam/dynamic-form-questions/text-area-question.component';
import { ValidationRules } from '../validation-rules.const';

export type SaveMissionNoteForm = Pick<MissionNote, "title" | "content" | "missionId" | "id">;

const TitleControl = <Immutable<DynamicControl<string, null, InputQuestion>>>{ 
    questionComponent: InputQuestionComponent,
    question: {placeholder: "Tittel"}, 
    validators: [Validators.maxLength(ValidationRules.MissionNoteTitleMaxLength)] 
}
const ContentControl = <Immutable<DynamicControl<string, null, TextAreaQuestion>>>{ 
    required: true, questionComponent: TextAreaQuestionComponent,
    question: {placeholder: "Beskrivelse", rows: 4},  
    validators: [Validators.maxLength(ValidationRules.MissionNoteContentMaxLength)] 
}

export const CreateMissionNoteModelForm: Immutable<ModelFormConfig<ModelState, MissionNote, SaveMissionNoteForm>> = {
    includes: {prop: "missionNotes"}, 
    dynamicForm: {
        submitText: "Legg til",
        controls: {
            title: TitleControl, 
            content: ContentControl, 
            missionId: { required: true, questionComponent: null }
        },
    }
}

export const EditMissionNoteModelForm: Immutable<ModelFormConfig<ModelState, MissionNote, SaveMissionNoteForm>> = {
    includes: {prop: "missionNotes"},
    dynamicForm: {
        submitText: "Oppdater",
        controls: {
            title: TitleControl, 
            content: ContentControl, 
            missionId: { required: true, questionComponent: null },
            id: { required: true, questionComponent: null }
        },
    }
}