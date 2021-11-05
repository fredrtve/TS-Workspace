import { ModelFile } from './base-entity-file.interface';
import { MissionActivity } from './mission-activity.interface';
import { MissionDocument } from './mission-document.interface';
import { MissionImage } from './mission-image.interface';
import { MissionNote } from './mission-note.interface';
import { EmployerForeign } from './relationships/employer-foreign.interface';
import { IAddress } from './sub-interfaces/iaddress.interface';
import { IContactable } from './sub-interfaces/icontactable.interface';
import { IPosition } from './sub-interfaces/iposition.interface';

export interface Mission extends ModelFile, EmployerForeign, IContactable, IAddress {
    description?: string;
    finished?: boolean;

    lastVisited?: number;
    
    missionImages?: MissionImage[];
    missionDocuments?: MissionDocument[];
    missionNotes?: MissionNote[];
    missionActivities?: MissionActivity[];

    position?: IPosition;
};