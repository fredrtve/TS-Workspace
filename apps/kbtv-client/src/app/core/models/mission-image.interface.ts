import { ModelFile } from './base-entity-file.interface';
import { MissionChild } from './relationships/mission-child.interface';

export interface MissionImage extends MissionChild, ModelFile { MissionImage?: string }
