import { Validators } from '@angular/forms';
import { MissionNote } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { InputQuestion, InputQuestionComponent } from '@shared/scam/dynamic-form-questions/input-question.component';
import { TextAreaQuestion, TextAreaQuestionComponent } from '@shared/scam/dynamic-form-questions/text-area-question.component';
import { DynamicControl } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

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
    actionConverter: _appFormToSaveModelConverter,
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