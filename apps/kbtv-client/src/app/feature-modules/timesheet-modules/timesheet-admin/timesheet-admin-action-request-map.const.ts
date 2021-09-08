import { CommandIdHeader } from "@core/configurations/command-id-header.const";
import { UpdateTimesheetStatusesRequest } from "@core/configurations/model/model-requests.interface";
import { _deleteModelRequest, _setSaveModelRequest } from "@core/configurations/optimistic/global-action-requests";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { _createActionRequestMap, _entry } from "optimistic-http";
import { TimesheetAdminActions } from "./state/actions.const";

export const TimesheetAdminActionRequestMap = _createActionRequestMap(
    _setSaveModelRequest,
    _deleteModelRequest,
    _entry(TimesheetAdminActions.updateTimesheetStatuses, (action): UpdateTimesheetStatusesRequest => ({
        method: "PUT", 
        body: {ids: action.ids, status: action.status}, 
        apiUrl: `/Timesheets/Status`,
        headers: { [CommandIdHeader]: _idGenerator(4) },
        type: UpdateTimesheetStatusesRequest
    })),
)