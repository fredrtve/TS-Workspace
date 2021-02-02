import { _addOrUpdateRange } from 'array-helpers';
import { MissionImage } from '@core/models';
import { StateMissionImages } from '@core/state/global-state.interfaces';
import { _createReducer } from 'state-management'
import { Immutable } from 'global-types';
import { CreateMissionImagesAction } from './create-mission-images.action';

export const CreateMissionImagesReducer = _createReducer(
    CreateMissionImagesAction,
    (state: Immutable<StateMissionImages>, action: Immutable<CreateMissionImagesAction>): Immutable<StateMissionImages> => {  
        if(!action.fileWrappers || !action.missionId) 
            console.error('no files or missionId provided');
    
        const entities: MissionImage[] = [];
        for(let i = 0; i < action.fileWrappers.length; i++){
            const wrapper = action.fileWrappers[i];
            const file = wrapper.modifiedFile;
            entities.push({
                id: <string> wrapper.id, 
                missionId: action.missionId, 
                fileName: wrapper.modifiedFile.name,
                localFileUrl: URL.createObjectURL(file)
            })
        }

        return {missionImages: _addOrUpdateRange(state.missionImages, entities, "id")};
    },
)