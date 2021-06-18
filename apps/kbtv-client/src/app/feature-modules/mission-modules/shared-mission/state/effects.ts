import { Injectable } from "@angular/core";
import { SaveModelFileAction } from "@core/global-actions";
import { AppNotificationService } from "@core/services/app-notification.service";
import { AppNotifications } from "@shared-app/constants/app-notifications.const";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _validateFileExtension } from "@shared-app/helpers/validate-file-extension.helper";
import { ModelFileForm, _formToSaveModelFileConverter } from "@shared/constants/form-to-save-model-file.converter";
import { Immutable } from "global-types";
import { ModelCommand } from 'model/state-commands';
import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DispatchedAction, Effect, listenTo } from "state-management";
import { CreateMissionImagesAction } from "./actions.const";

@Injectable()
export class CreateMissionImagesEffect implements Effect<CreateMissionImagesAction> {

    constructor(private notificationService: AppNotificationService){}

    handle$(actions$: Observable<DispatchedAction<CreateMissionImagesAction, {}>>) {
        return actions$.pipe(
            listenTo([CreateMissionImagesAction]),
            mergeMap(x => { 
                const actions: Immutable<SaveModelFileAction>[] = [];
   
                for(const key in x.action.files){
                    const file = x.action.files[key];

                    if(!_validateFileExtension(file, ValidationRules.MissionImageFileExtensions)){
                        this.notificationService.notify(AppNotifications.invalidFileFormat())
                        continue;
                    }

                    actions.push(_formToSaveModelFileConverter({
                        stateProp: "missionImages", 
                        formValue: <ModelFileForm> { missionId: x.action.missionId, file}, 
                        saveAction: ModelCommand.Create
                    }))
                }

                return of(...actions);
            })
        )
    }
    
}