import { Injectable } from "@angular/core";
import { GlobalActions, SaveModelFilePayload } from "@core/global-actions";
import { AppNotificationService } from "@core/services/app-notification.service";
import { AppNotifications } from "@shared-app/constants/app-notifications.const";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { Immutable, Maybe } from "global-types";
import { ActionInterceptor, StateAction } from "state-management";

@Injectable()
export class SaveModelFileValidatorInterceptor implements ActionInterceptor {

    private saveModelFileType = GlobalActions.saveModelFile(<any>{}).type;

    constructor(private notificationService: AppNotificationService){}

    intercept(action: Immutable<StateAction & SaveModelFilePayload>): Maybe<StateAction> {
        if(action.type !== this.saveModelFileType) return action;
        if(this.hasMaxContentLength(action)) return null;
        return action;
    }

    private hasMaxContentLength(action: Immutable<SaveModelFilePayload>): boolean {
        const size = action.file?.size;
        if(!size || size < ValidationRules.ContentMaxByteLength) return false;
        this.notificationService.notify(AppNotifications.maxContentLength(size))
        return true;
    }
}