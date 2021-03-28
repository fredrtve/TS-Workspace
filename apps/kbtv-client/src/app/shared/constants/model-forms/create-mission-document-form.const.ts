import { MissionDocument } from '@core/models';
import { fileExtensionValidator } from '@shared/validators/file-extension.validator';
import { fileSizeValidator } from '@shared/validators/file-size.validator';
import { DynamicControl, DynamicForm } from 'dynamic-forms';
import { Immutable } from 'global-types';
import { FileQuestionComponent } from '../../components/dynamic-form-questions/file-question.component';
import { HiddenMissionIdControl, NameControl } from '../common-controls.const';
import { ValidationRules } from '../validation-rules.const';

export interface MissionDocumentForm extends Partial<MissionDocument>{
    missionId: string;
    name: string;
    file: File;
}

const FileControl = <Immutable<DynamicControl<MissionDocumentForm, {}>>>{ name: "file", required: true,
    type: "control", questions: [{
        component:  FileQuestionComponent, question: {}
    }],
    validators: [
        fileExtensionValidator(ValidationRules.MissionDocumentFileExtensions),
        fileSizeValidator(ValidationRules.ContentMaxByteLength)
    ]
}

export const CreateMissionDocumentForm: Immutable<DynamicForm<MissionDocumentForm, {}>> = {
    submitText: "Legg til",
    controls: [{...NameControl, required: true}, FileControl, HiddenMissionIdControl],
}