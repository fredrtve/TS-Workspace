
import { ModelFile } from './base-entity-file.interface';
import { MissionChild } from './relationships/mission-child.interface';
import { IName } from './sub-interfaces/iname.interface';

export interface MissionDocument extends MissionChild, ModelFile, IName { MissionDocument?: string }
