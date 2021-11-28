import { Immutable } from "@fretve/global-types";
import { ActionCreator } from "../interfaces";

/** Represents a function that creates an {@link ActionCreator}
 *  @param type - A string that uniquely identifies this action
 *  @param payload - An optional structure representing the payload, use {@link _payload}.
 */
export const _createAction = <TType extends string, TPayload extends object | undefined = undefined>(
    type: TType,
    payload?: Immutable<TPayload>,
): ActionCreator<TPayload, TType> => {
    return payload 
        ? <any> ((prs: any) => ({ ...prs, type })) 
        : () => ({type})
} 

export const _payload = <T extends object>(): Immutable<T> => <any> {};