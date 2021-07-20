import { Maybe } from "global-types";

export function _tryWithLogging<TResult>(func: () => TResult): Maybe<TResult> {
    var result: Maybe<TResult> = undefined;
    try{
        result = func()
    }catch(err){
        console.error(err)
    };
    return result;
}