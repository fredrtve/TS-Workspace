/**
 * A library of generic typescript types
 * @packageDocumentation
 */

/** A value with immutable object properties */
export type ShallowCopy<T> ={
    [P in keyof T]: Immutable<T[P]>;
}

export type UnionOmit<TUnion extends string | number | symbol, TOmit extends string | number | symbol> =  keyof {
    [P in TUnion as P extends TOmit ? never : P]: any 
};

interface Cool { test: string, not: Not, arris: Not[] }
interface Not { noe: number, arriss: string[] }

type www = (Immutable<Immutable<Cool>> | undefined) extends (Immutable<Cool> | undefined)  ? true : false;
/** A value that can't be mutated */
export type Immutable<T> =
    T extends (infer R)[] ? ImmutableArray<R> :
    T extends Function ? T :
    T extends object ? ImmutableObject<T> :
    T;

export interface ImmutableArray<T> extends ReadonlyArray<Immutable<T>> {}

export type ImmutableObject<T> = 
    T extends ImmutableArray<any> ? T : 
    { readonly [P in keyof T]: Immutable<T[P]> };

export type UnknownState = {[key: string]: unknown}

export type Maybe<T> = T | null | undefined;

export type DateInput = Date | string | number;

export type Prop<T> = Extract<keyof T, string>;

export type KeyVal<T> = { [key: string]: Immutable<T> }

export type UnionTupleType<A extends any[]> = A extends { [n: number]: infer T } ? T : never;

export type NotNull<T> = Exclude<T, null| undefined>

export type ValueOf<T> = T[keyof T];
/** Creates a lookup type with properties of T with values that extends U */
export type PickByValueType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K]
}

/** Get a union of all properties on TObject, including properties of nested objects. Format 'prop1 | prop2 | prop2.sub1' */
export type DeepProp<TObject> = ValueOf<{
    [P in Prop<TObject>]: TObject[P] extends object ?   
        ( P | `${P}.${DeepProp<TObject[P]>}` ) : P
}>

/** Get the value type of a deep property {@link DeepProp} TPath on TObject.  */
export type DeepPropType<TObject, TPath extends string, TElse> =
    TPath extends keyof TObject ? TObject[TPath] :
    TPath extends `${infer LeftSide}.${infer RightSide}` ? LeftSide extends keyof TObject ? DeepPropType<TObject[LeftSide], RightSide, TElse> : 
    TElse : TElse;

/** Constructs an object with deep propeties TPath with value types from TObject  */
export type DeepPropsObject<TObject, Path extends string> = { [P in Path]: DeepPropType<TObject, P, never> }