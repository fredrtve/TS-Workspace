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

/** Constructs an nested object according to TPath with TValue as value for last subpath.*/
export type ConstructSliceFromPath<TPath extends string, TObject> = 
    TPath extends `${infer LeftSide}.${infer RightSide}` 
    ? LeftSide extends keyof TObject 
    ? {[P in LeftSide]: ConstructSliceFromPath<RightSide, TObject[LeftSide]>}
    : never
    : TPath extends keyof TObject ? {[P in TPath]: TObject[TPath]} : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type PartialByObj<T, K> = PartialBy<T, InnerJoinKeys<T, K>>

export type RequiredKeys<T extends object> = keyof {
    [P in keyof T as undefined extends T[P] ? never : P]: any
};

export type HasRequiredKeys<T> = T extends object ? RequiredKeys<T> extends never ? false : true : true;

export type InnerJoinKeys<A,B> = keyof { [P in keyof A as P extends keyof B ? P : never]: A[P] }

export type MakeKeysOptionalIfOptionalObject<T> = 
    { [P in keyof T as HasRequiredKeys<T[P]> extends true ? P : never]: T[P]; } &
    { [P in keyof T as HasRequiredKeys<T[P]> extends false ? P : never]?: T[P]; } 

export type MakeKeysOptionalIfOptionalObjectDeep<T> = MakeKeysOptionalIfOptionalObject<
    { [P in keyof T]: IsPlainObject<T[P]> extends false ? T[P] : MakeKeysOptionalIfOptionalObjectDeep<T[P]> }
>

export type IsPlainObject<T> = T extends any[] ? false : 
    T extends Function ? false : 
    T extends false ? false : 
    T extends object ? true : false;