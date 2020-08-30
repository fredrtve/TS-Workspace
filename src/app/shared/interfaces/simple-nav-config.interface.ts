import { AppButton } from '../../shared-app/interfaces/app-button.interface';

export interface SimpleNavConfig{
    title?: string;
    colorClass?: string;
    leftBtn?: AppButton;
    buttons?: AppButton[];
}