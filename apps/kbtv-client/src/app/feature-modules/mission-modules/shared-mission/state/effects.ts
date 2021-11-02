import { Injectable } from "@angular/core";
import { AppNotificationService } from "@core/services/app-notification.service";
import { AppNotifications } from "@shared-app/constants/app-notifications.const";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _validateFileExtension } from "@shared-app/helpers/validate-file-extension.helper";
import { ModelFileForm, _formToSaveModelFileConverter } from "@shared/constants/form-to-save-model-file.converter";
import { Immutable } from "global-types";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DispatchedActions, Effect, listenTo, StateAction } from "state-management";
import { SharedMissionActions } from "./actions.const";

@Injectable()
export class CreateMissionImagesEffect implements Effect {

    constructor(private notificationService: AppNotificationService){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([SharedMissionActions.createMissionImages]),
            mergeMap(x => { 
                const actions: Immutable<StateAction>[] = [];
   
                for(const key in x.action.files){
                    const file = x.action.files[key];

                    if(!_validateFileExtension(file, ValidationRules.MissionImageFileExtensions)){
                        this.notificationService.notify(AppNotifications.invalidFileFormat())
                        continue;
                    }
                    
                    actions.push(_formToSaveModelFileConverter({
                        stateProp: "missionImages", 
                        formValue: <ModelFileForm> { missionId: x.action.missionId, fileList: [file] },
                        initialValue: {}
                    }))
                }

                return of(...actions);
            })
        )
    }
    
}