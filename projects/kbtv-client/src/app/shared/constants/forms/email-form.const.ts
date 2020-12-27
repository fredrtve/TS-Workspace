import { DynamicForm } from '@dynamic-forms/interfaces';
import { EmailControl } from '../common-controls.const';

export interface EmailForm { email: string };

export const EmailForm: DynamicForm<EmailForm, unknown> = {
    submitText: "Send", controls: [{...EmailControl, required: true}],
}