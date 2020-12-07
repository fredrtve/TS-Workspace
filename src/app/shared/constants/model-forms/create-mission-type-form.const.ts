import { MissionType } from '@core/models';
import { DynamicForm } from '@dynamic-forms/interfaces';
import { NameControl } from '../common-controls.const';

export const CreateMissionTypeForm: DynamicForm<MissionType, any> = {
    submitText: "Legg til", controls: [ {...NameControl, required: true} ],
}