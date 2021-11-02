import { ApiUrl } from "../../api-url.enum";
import { ModelState } from "../../state/model-state.interface";

export const ModelBaseUrls: Partial<Record<keyof ModelState, string>> = {
    missions: ApiUrl.Mission,
    missionImages: ApiUrl.MissionImage,
    missionDocuments: ApiUrl.MissionDocument,
    missionNotes: ApiUrl.MissionNote,
    employers: ApiUrl.Employer,
    missionTypes: ApiUrl.MissionType,
    timesheets: ApiUrl.Timesheet,
    userTimesheets: ApiUrl.Timesheet,
    users: ApiUrl.Users,
    inboundEmailPasswords: ApiUrl.InboundEmailPassword
}