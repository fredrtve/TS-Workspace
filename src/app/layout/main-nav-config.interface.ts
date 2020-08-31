import { AppButton } from '../shared-app/interfaces/app-button.interface';
import { User } from 'src/app/core/models';

export interface MainNavConfig{
    isXs?: boolean;
    currentUser?: User;

    topDefaultNavConfig?: TopDefaultNavConfig;
    topDetailNavConfig?: TopDetailNavConfig;  

    fabs?: AppButton[];
}

export interface TopDefaultNavConfig extends TopNavActions{
    title: string;
    subTitle?:string;
    subIcon?: string;

    searchBar?: SearchBarConfig;
}

export interface TopDetailNavConfig extends TopNavActions{   
    title?: string[];
    subTitle?:string;
    subIcon?: string;

    imgSrc?: string;
}

export interface TopNavActions{
    backFn?: Function;
    backFnParams?: any[];
    buttons?: AppButton[];
    bottomSheetButtons?: AppButton[];
}

export interface SearchBarConfig{
    callback: Function, 
    placeholder: string
}