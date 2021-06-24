import { AppButton } from "@shared-app/interfaces/app-button.interface";

export interface MainTopNavConfig  {
    customCancelFn?: Function;
    buttons?: AppButton[];
    optimisitcSpinnerDisabled?: boolean;
}