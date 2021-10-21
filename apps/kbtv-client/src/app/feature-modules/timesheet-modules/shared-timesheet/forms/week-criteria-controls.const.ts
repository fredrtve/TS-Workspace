import { StateUsers } from '@core/state/global-state.interfaces';
import { WeekCriteria } from '@shared-timesheet/interfaces';
import { UserSelectControl } from '@shared/constants/common-controls.const';
import { InputFieldComponent } from 'mat-dynamic-form-controls';
import { IonDateControlComponent } from '@shared/scam/dynamic-form-controls/ion-date-time-control.component';
import { isWeekInRange } from '@shared/validators/is-week-in-range.validator';
import { DynamicFormBuilder } from 'dynamic-forms';

export type WeekCriteriaFormState = StateUsers;
export interface WeekCriteriaForm extends Pick<WeekCriteria, "user" | "year"> { weekNr: string }

const builder = new DynamicFormBuilder<WeekCriteriaForm, WeekCriteriaFormState>();

export const WeekCriteriaForm = builder.form({
    validators$: [isWeekInRange("weekNr", "year")],
    controls: {
        user: {...UserSelectControl, required$: true},
        year: builder.field<IonDateControlComponent<number>>({ required$: true,
            viewComponent: IonDateControlComponent,     
            viewOptions: { 
                placeholder$: "Velg år", 
                ionFormat$: "YYYY", 
                valueSetter: (val) => new Date(val).getFullYear() 
            },
        }),
        weekNr: builder.field({ required$: true,
            viewComponent: InputFieldComponent,
            viewOptions: { 
                placeholder$: "Velg uke", 
                type$: "tel",
            }, 
        }),
    },
    overrides: {
        user: { viewOptions: { options$: builder.bindState('users') } },
        weekNr: { controlClass$: builder.bindForm("weekNr", (nr) => nr == null ? "display-none" : "")  }
    }
});