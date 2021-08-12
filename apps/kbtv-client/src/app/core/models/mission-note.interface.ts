import { MissionChild } from './relationships/mission-child.interface';
import { IId } from './sub-interfaces/iid.interface';

export interface MissionNote extends MissionChild, IId{
    title?: string;
    content: string;
    createdBy?: string;
};
