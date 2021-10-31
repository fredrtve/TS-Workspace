import { EmailControl } from '@shared/constants/common-controls.const';
import { DynamicFormBuilder } from 'dynamic-forms';
import { FormSheetViewConfig } from 'form-sheet';

export interface EmailForm { email: string };

const builder = new DynamicFormBuilder<EmailForm>()

const EmailForm = builder.group()({
    viewOptions:{}, viewComponent: null,
    controls: { email: EmailControl },
    overrides: {
        email: { required$: true, }
    }
});

export function _emailFormFactory(title: string, presetEmail: string): FormSheetViewConfig<EmailForm> {
    return {
        formConfig: {...EmailForm,  }, 
        navConfig: { title },
        actionConfig: { allowPristine: presetEmail != null }
    }
}