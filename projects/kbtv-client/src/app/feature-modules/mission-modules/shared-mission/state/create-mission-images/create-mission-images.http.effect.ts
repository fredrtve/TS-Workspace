import { Injectable } from '@angular/core';
import { ApiUrl } from '@core/api-url.enum';
import { Immutable } from 'global-types';
import { FormDataEntry, OptimisticHttpRequest, OptimisticHttpAction } from 'optimistic-http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DispatchedAction, Effect, listenTo } from 'state-management';
import { CreateMissionImagesAction } from './create-mission-images.action';

@Injectable()
export class CreateMissionImagesHttpEffect implements Effect<CreateMissionImagesAction>{

    handle$(actions$: Observable<DispatchedAction<CreateMissionImagesAction>>): Observable<OptimisticHttpAction> {
        return actions$.pipe(
            listenTo([CreateMissionImagesAction]),
            map(x => <OptimisticHttpAction>{ 
                type: OptimisticHttpAction, propagate: true,
                request: this.createHttpRequest(x.action), 
                stateSnapshot: x.stateSnapshot 
            }),        
        )
    }

    private createHttpRequest(command: Immutable<CreateMissionImagesAction>): OptimisticHttpRequest{
        return {
            apiUrl: `${ApiUrl.MissionImage}?missionId=${command.missionId}`,
            body: this.createHttpBody(command),
            method: "POST",
            cancelMessage: `Oppretting av ${command.fileWrappers.length} bilder på oppdrag ${command.missionId} er reversert.`
        }
    }

    private createHttpBody(command: Immutable<CreateMissionImagesAction>): FormDataEntry[] {
        const entries: FormDataEntry[] = [];
        for(let i = 0; i < command.fileWrappers.length; i++){
            const file = command.fileWrappers[i].modifiedFile;
            entries.push({name: "file", value: file})
        }
        return entries;
    }

}