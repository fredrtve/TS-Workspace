import { Injectable } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { StateMissions, StateUsers } from "@core/state/global-state.interfaces";
import { TimesheetCriteriaForm, TimesheetCriteriaFormSheet, TimesheetCriteriaFormState, UserTimesheetCriteriaForm, UserTimesheetCriteriaFormSheet, UserTimesheetCriteriaFormState, _criteriaFormToTimesheetCriteria, _timesheetCriteriaToForm } from "@shared-timesheet/forms/timesheet-criteria-form.const";
import { FormService } from "form-sheet";
import { Immutable } from "global-types";
import { map } from "rxjs/operators";
import { Store } from "state-management";
import { StateSyncConfig } from "state-sync";
import { _noEmployersFilter } from "./no-employers-filter.helper";
import { TimesheetCriteria } from "./timesheet-filter/timesheet-criteria.interface";

@Injectable({providedIn: "any"})
export class TimesheetCriteriaFormService { 

    constructor(
        private formService: FormService,
        private store: Store<StateMissions & StateUsers>
    ){}

    open(onSubmit: (t: Immutable<TimesheetCriteria>) => void, initialValue?: Immutable<TimesheetCriteria>): MatBottomSheetRef {
        return this.formService.open<TimesheetCriteriaForm, TimesheetCriteriaFormState>(
            TimesheetCriteriaFormSheet,
            { 
                initialValue: initialValue ? _timesheetCriteriaToForm(initialValue) : null,
                formState: this.store.select$(["missions", "users"]).pipe(
                    map(state => { return { ...state, users: _noEmployersFilter(state.users) }}))
            },
            (val) => onSubmit(_criteriaFormToTimesheetCriteria(val))
        )
    }
}

@Injectable({providedIn: "any"})
export class UserTimesheetCriteriaFormService {
    constructor(
        private formService: FormService,
        private store: Store<StateMissions & StateSyncConfig>
    ){}

    open(onSubmit: (t: Immutable<TimesheetCriteria>) => void, initialValue?: Immutable<TimesheetCriteria>): MatBottomSheetRef {
        return this.formService.open<UserTimesheetCriteriaForm, UserTimesheetCriteriaFormState>(
            UserTimesheetCriteriaFormSheet,
            { 
                initialValue: initialValue ? _timesheetCriteriaToForm(initialValue) : null, 
                formState: this.store.select$(["missions", "syncConfig"]) 
            },
            (val) => onSubmit(_criteriaFormToTimesheetCriteria(<Immutable<UserTimesheetCriteriaForm>> val))
        )
    }
}