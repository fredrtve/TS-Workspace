import { Provider } from "@angular/core";
import { StateManagementModule } from "state-management";
import { UserTimesheetListFacade } from "../user-timesheet-list.facade";
import { UserTimesheetListLocalReducers } from "./local-state";

export const UserTimesheetListProviders: Provider[] = [
    UserTimesheetListFacade,
    ...StateManagementModule.forComponent({ reducers: UserTimesheetListLocalReducers }),
]