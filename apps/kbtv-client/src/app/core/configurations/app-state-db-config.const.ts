import { StateActivities, StateCurrentUser, StateEmployers, StateLeaderSettings, StateMissionActivities, StateMissionDocuments, StateMissionImages, StateMissionNotes, StateMissions, StateMissionTypes, StateUserTimesheets } from "../state/global-state.interfaces";
import { StateRequestQueue } from "optimistic-http";
import { StoreState } from "state-auth";
import { StateDbConfig } from 'state-db';
import { StateSyncConfig, StateSyncTimestamp } from "state-sync";

type PersistedState = StateMissions & StateMissionDocuments & StateMissionImages & StateMissionNotes & StateMissionActivities & StateActivities &
    StateMissionTypes & StateEmployers & StateUserTimesheets  & StateLeaderSettings & StateRequestQueue &
    StoreState & StateCurrentUser & StateSyncConfig & StateSyncTimestamp

export const AppStateDbConfig: StateDbConfig<PersistedState> = {
    missions: { storageType: "idb-keyval" },
    missionDocuments: { storageType: "idb-keyval" },
    missionImages: { storageType: "idb-keyval" },
    missionNotes: { storageType: "idb-keyval" },
    missionTypes: { storageType: "idb-keyval" },
    missionActivities: { storageType: "idb-keyval" },
    activities: { storageType: "idb-keyval" },
    employers: { storageType: "idb-keyval" },
    userTimesheets: { storageType: "idb-keyval" },
    requestQueue: { storageType: "idb-keyval" },
    leaderSettings: { storageType: "idb-keyval" },
    accessToken: { storageType: "localStorage" },
    accessTokenExpiration: { storageType: "localStorage" },
    refreshToken: { storageType: "localStorage" },
    currentUser: { storageType: "localStorage" },       
    syncTimestamp: { storageType: "localStorage" },
    syncConfig: { storageType: "localStorage" }, 
}