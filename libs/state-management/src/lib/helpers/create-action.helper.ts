import { Immutable } from "global-types";
import { ActionCreator } from "../interfaces";

export const _createAction = <TType extends string, TPayload extends object | undefined = undefined>(
    type: TType,
    payload?: Immutable<TPayload>,
): ActionCreator<TPayload, TType> => {
    return payload 
        ? <any> ((prs: any) => ({ ...prs, type })) 
        : () => ({type})
} 

export const _payload = <T extends object>(): Immutable<T> => <any> {};