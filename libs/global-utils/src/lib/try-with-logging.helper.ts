import { Maybe } from "@fretve/global-types";

/** An higher order function that writes errors from an function to the console. 
 * @param func - The function that should be executed
 * @returns The result of the input function
  */
export function _tryWithLogging<TResult>(func: () => TResult): Maybe<TResult> {
    var result: Maybe<TResult> = undefined;
    try{
        result = func()
    }catch(err){
        console.error(err)
    };
    return result;
}