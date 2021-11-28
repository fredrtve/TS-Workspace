import { Immutable } from "@fretve/global-types";

export function _deepFreeze<T extends {}>(obj: Immutable<T>): Immutable<T> {
    if(typeof obj !== "object") return obj;

    if(Array.isArray(obj) && obj.length && typeof obj[0] === "object")
        for(const arrObj of obj) _deepFreeze(arrObj);
    else
        for(const prop in obj){
            const value = obj[prop];
            if (typeof value === 'object' && !Object.isFrozen(value)) _deepFreeze(<{}> value);
        }

    return <Immutable<T>> Object.freeze(obj);
  };