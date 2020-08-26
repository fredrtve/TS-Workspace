import { Injectable } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ApiUrl } from 'src/app/core/api-url';
import { AppDocumentType, Employer, Mission, MissionDocument, MissionImage } from "src/app/core/models";
import {
  ApiService,
  ArrayHelperService
} from "src/app/core/services";
import { BaseModelStore } from "../../core/state";
import { StoreState } from './store-state';

@Injectable({
  providedIn: 'any',
})
export class MissionDocumentListStore extends BaseModelStore<StoreState>  {

  constructor(
    apiService: ApiService,
    arrayHelperService: ArrayHelperService
  ) {
    super(arrayHelperService, apiService, {trackStateHistory: true,logStateChanges: true});
  }

  getByMissionIdWithType$(id: number): Observable<MissionDocument[]>{
    return combineLatest(
      this._getBy$("missionDocuments", (doc: MissionDocument) => doc.missionId === id),
      this.property$<AppDocumentType[]>("documentTypes")
    ).pipe(map(([documents, types]) => 
        documents?.map(x => {
          x.documentType = types?.find(type => type.id === x.documentTypeId);
          return x;
        })
    ));
  } 

  getMissionEmployer(missionId: number): Employer{
    let mission = this.arrayHelperService.find(this.getProperty<Mission[]>("missions", false), missionId, 'id');
    if(!mission?.employerId) return null;
    let employer = this.arrayHelperService.find(this.getProperty<Employer[]>("employers", false), mission.employerId, 'id');
    return {...employer}
  }

  mailDocuments$(toEmail: string, missionDocumentIds: number[]){
    return this.apiService
              .post(`${ApiUrl.MissionDocument}/SendImages`, {toEmail, missionDocumentIds});
  }

  deleteRange$(ids: number[]): Observable<void> {
    return this.apiService.post(`${ApiUrl.MissionDocument}/DeleteRange`, {Ids: ids})    
        .pipe(
          tap(x => this._updateMissionDocuments(
            StoreActions.DeleteRangeMissionDocument, 
            (imgs: MissionImage[]) => this.arrayHelperService.removeRangeByIdentifier(imgs, ids, 'id')))
        );   
  }

  private _updateMissionDocuments(action: string, actionFn: (notes: MissionImage[]) => MissionImage[]){
    this._updateStateProperty("missionDocuments", action, actionFn);
  }
}

export enum StoreActions {
  DeleteRangeMissionDocument = "deleteRange_missionDocuments"
}