import { StateCurrentUser } from '../state/global-state.interfaces';
import { ModelState } from '../state/model-state.interface';
import { OptimisticStateSelector } from 'optimistic-http';
import { StateSyncTimestamp } from 'state-sync';

type State = ModelState & StateSyncTimestamp & StateCurrentUser
export const AppOptimisticState: OptimisticStateSelector<State> = {
    strategy: "include",
    props: [
        "missions",
        "missionDocuments",
        "missionImages",
        "missionNotes", 
        "missionTypes", 
        "employers",
        "userTimesheets", 
        "currentUser",
        "syncTimestamp",
    ]
}
