import { Injectable } from "@angular/core";
import { Mission, MissionImage } from "@core/models";
import { ModelState } from '@core/state/model-state.interface';
import { _filter } from "array-helpers";
import { ImmutableArray, Maybe } from 'global-types';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Store } from 'state-management';
import { DeleteModelAction } from 'model/state-commands';
import { RelationInclude, _getModel } from 'model/core';
import { StoreState } from './store-state';
import { MailModelsAction } from "@core/state/mail-models/mail-models.action";
import { CreateMissionImagesAction } from "@shared-mission/state/actions.const";

@Injectable({providedIn: 'any'})
export class MissionImageListFacade {

  constructor(private store: Store<StoreState>) { }

  getMissionImages$(missionId: Maybe<string>): Observable<ImmutableArray<MissionImage>> {
    return this.store.selectProperty$("missionImages").pipe(
      map(images => _filter(images, (x: MissionImage) => x.missionId === missionId))
    )
  }

  getMissionEmployerEmail(missionId: Maybe<string>): string{  
    const cfg: RelationInclude<ModelState, Mission> = {prop: "missions", foreigns: ["employer"]}
    const mission = _getModel<ModelState, Mission>(this.store.state, missionId, cfg);
    const email = mission?.employer?.email;
    return email || "";
  }

  add = (missionId: string, files: FileList): void =>
    this.store.dispatch(<CreateMissionImagesAction>{type: CreateMissionImagesAction, missionId, files: {...files}});
   
  delete = (payload: {ids?: string[], id?: string}): void => 
    this.store.dispatch<DeleteModelAction<ModelState, MissionImage>>({type: DeleteModelAction, stateProp: "missionImages", payload});

  mailImages = (toEmail: string, ids: string[]): void => 
    this.store.dispatch(<MailModelsAction<MissionImage>>{type: MailModelsAction, stateProp: "missionImages", ids, toEmail})
  
}