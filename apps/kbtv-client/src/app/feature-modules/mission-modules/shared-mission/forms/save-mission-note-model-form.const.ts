import { Validators } from '@angular/forms';
import { MissionNote } from '@core/models';
import { ModelState } from '@core/state/model-state.interface';
import { ValidationRules } from '@shared-app/constants/validation-rules.const';
import { _appFormToSaveModelConverter } from '@shared/app-form-to-save-model.converter';
import { TextAreaControlComponent, InputControlComponent } from 'mat-dynamic-form-controls';
import { DynamicFormBuilder } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { ModelFormConfig } from 'model/form';

export type SaveMissionNoteForm = Pick<MissionNote, "title" | "content" | "missionId" | "id">;

const builder = new DynamicFormBuilder<SaveMissionNoteForm, ModelState>();

const TitleControl = builder.control({ 
    controlComponent: InputControlComponent,
    viewOptions: {placeholder$: "Tittel"}, 
    validators$: [Validators.maxLength(ValidationRules.MissionNoteTitleMaxLength)] 
});

const ContentControl = builder.control({ 
    controlComponent: TextAreaControlComponent, required$: true,
    viewOptions: {placeholder$: "Beskrivelse", rows$: 4},  
    validators$: [Validators.maxLength(ValidationRules.MissionNoteContentMaxLength)] 
})

export const MissionNoteModelForm: Immutable<ModelFormConfig<ModelState, MissionNote, SaveMissionNoteForm>> = {
    includes: {prop: "missionNotes"}, 
    actionConverter: _appFormToSaveModelConverter,
    dynamicForm: builder.form({
        controls: {
            title: TitleControl, 
            content: ContentControl, 
            missionId: { controlComponent: null, required$: true, viewOptions: {} },
            id: { controlComponent: null, viewOptions: {} }
        },
        overrides: {}
    })
}
