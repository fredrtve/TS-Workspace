import { StateAction } from "state-management";

export const UpdateLastVisitedAction = "UPDATE_LAST_VISITED_ACTION";
export interface UpdateLastVisitedAction extends StateAction<typeof UpdateLastVisitedAction> {
    id: string
}
