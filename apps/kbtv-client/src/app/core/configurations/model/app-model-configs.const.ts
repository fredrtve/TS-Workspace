import { ModelState } from '../../state/model-state.interface';
import { _idGenerator } from '@shared-app/helpers/id/id-generator.helper';
import { Immutable } from 'global-types';
import { StateModels, ValidStateModelArray, ModelChildrenMap } from 'model/core';
import { ModelFetcherConfig } from 'model/state-fetcher';
import { ApiUrl } from '../../api-url.enum';
import { Mission, User } from '../../models';
import { ModelIdProps } from './model-id-props.const';

export type AppModelConfigMap = { 
    [P in keyof ModelState]: ModelState[P] extends ValidStateModelArray<(infer M)> ? 
    M extends StateModels<ModelState> ? 
    Immutable<AppModelConfig<M>> : 
    never : never
  };

export interface AppModelConfig<TModel extends StateModels<ModelState>> extends ModelFetcherConfig<ModelState, TModel> {}

export const ModelConfigMap: AppModelConfigMap = {
    missions: {
        stateProp: "missions",
        idProp: ModelIdProps.missions, 
        displayFn: (m) => m.address!,
        idGenerator: _idGenerator,
        children: {
            missionImages: {stateProp: "missionImages", childKey: "missionId", cascadeDelete: true}, 
            missionDocuments: {stateProp: "missionDocuments", childKey: "missionId", cascadeDelete: true},
            missionNotes: {stateProp: "missionNotes", childKey: "missionId", cascadeDelete: true}, 
            missionActivities: {stateProp: "missionActivities", childKey: "missionId", cascadeDelete: true}, 
        }, 
        foreigns: {
            missionType: {stateProp: "missionTypes", foreignKey: "missionTypeId"},
            employer: {stateProp: "employers", foreignKey: "employerId"}
        },       
    },
    missionTypes: {
        stateProp: "missionTypes", 
        idProp: ModelIdProps.missionTypes,
        displayFn: (m) => m.name,
        idGenerator: _idGenerator,
        foreigns: {}, children: {}
    },
    employers: {
        stateProp: "employers",
        idProp: ModelIdProps.employers,  
        displayFn: (m) => m.name!,   
        idGenerator: _idGenerator, 
        foreigns: {}, children: {}
    },   
    missionActivities: {
        stateProp: "missionActivities",
        idProp: ModelIdProps.missionActivities,  
        idGenerator: _idGenerator,
        children: {
            timesheets: { stateProp: "timesheets", childKey: "missionActivityId" },
            userTimesheets: { stateProp: "userTimesheets", childKey: "missionActivityId" },
        },
        foreigns: { 
            mission: { stateProp: "missions", foreignKey: "missionId" },   
            activity: { stateProp: "activities", foreignKey: "activityId" },    
        }, 
    }, 
    missionImages: {
        stateProp: "missionImages",
        idProp: ModelIdProps.missionImages,  
        idGenerator: _idGenerator,
        children: {},
        foreigns: { 
            mission: { stateProp: "missions", foreignKey: "missionId" }
        }, 
    },    
    missionDocuments: {
        stateProp: "missionDocuments",
        idProp: ModelIdProps.missionDocuments, 
        displayFn: (m) => m.name,
        idGenerator: _idGenerator,
        children: {},
        foreigns: { 
            mission: { stateProp: "missions", foreignKey: "missionId" }
        }, 
    },    
    missionNotes: {
        stateProp: "missionNotes",
        idProp: ModelIdProps.missionNotes,
        displayFn: (m) => `${m.title || 'Uten tittel'}`, 
        idGenerator: _idGenerator,
        children: {},
        foreigns: { 
            mission: { stateProp: "missions", foreignKey: "missionId" }
        }, 
    },
    users: {
        stateProp: "users",
        idProp: ModelIdProps.users, 
        displayFn: (m: User) => m.userName,    
        children: {},
        foreigns: {
            employer: { stateProp: "employers", foreignKey: "employerId" }
        },      
        fetchUrl: ApiUrl.Users,
    },      
    inboundEmailPasswords: {
        stateProp: "inboundEmailPasswords",
        idProp: ModelIdProps.inboundEmailPasswords, 
        displayFn: (m) => m.password!, 
        children: {}, foreigns: {},
        fetchUrl: ApiUrl.InboundEmailPassword, 
        idGenerator: _idGenerator,   
    }, 
    userTimesheets: {
        stateProp: "userTimesheets",
        idProp: ModelIdProps.userTimesheets,
        displayFn: (m) => m.id!,
        idGenerator: _idGenerator,
        children: {},
        foreigns: { 
            missionActivity: { stateProp: "missionActivities", foreignKey: "missionActivityId" },
        },            
    },    
    timesheets: {
        stateProp: "timesheets",
        idProp: ModelIdProps.timesheets, 
        displayFn: (m) => m.id!,
        idGenerator: _idGenerator,
        children: {},
        foreigns: { 
            missionActivity: { stateProp: "missionActivities", foreignKey: "missionActivityId" },
            user: { stateProp: "users", foreignKey: "userName" }
        },     
    },    
    activities: {
        stateProp: "activities",
        idProp: ModelIdProps.activities,  
        idGenerator: _idGenerator,
        children: {}, foreigns: {}, 
    }, 
}