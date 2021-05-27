import { ModelState } from '@core/state/model-state.interface';
import { _idGenerator } from '@shared-app/helpers/id/id-generator.helper';
import { Immutable } from 'global-types';
import { StateModels, ValidStateModelArray } from 'model/core';
import { ModelFetcherConfig } from 'model/state-fetcher';
import { ApiUrl } from '../../api-url.enum';
import { User } from '../../models';
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
            timesheets: {stateProp: "timesheets", childKey: "missionId"},
            userTimesheets: {stateProp: "userTimesheets", childKey: "missionId"},
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
        displayFn: (m) => `(${m.id}) ${m.title || 'Uten tittel'}`, 
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
            mission: { stateProp: "missions", foreignKey: "missionId" }
        },            
    },    
    timesheets: {
        stateProp: "timesheets",
        idProp: ModelIdProps.timesheets, 
        displayFn: (m) => m.id!,
        idGenerator: _idGenerator,
        children: {},
        foreigns: { 
            mission: { stateProp: "missions", foreignKey: "missionId" },
            user: { stateProp: "users", foreignKey: "userName" }
        },     
    }, 
}