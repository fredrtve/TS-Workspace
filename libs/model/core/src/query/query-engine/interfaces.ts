import { Immutable, ShallowCopy, ValueOf } from "@fretve/global-types";

export interface QueryAction<TType, TValueType>{ 
    type: TType,
    value: TValueType
}

export type InferHandlerActionValue<T> = T extends QueryActionHandler<any, (infer Value), any> ? Value : never;

export type InferHandlerMapOptions<T> = T extends QueryActionHandlerMap<any, (infer Options)> ? Options : never;

export type InferHandlerMapValue<T> = T extends QueryActionHandlerMap<(infer Value), any> ? Value : never;

export type QueryActions<THandlerMap> = 
    ValueOf<{[P in keyof THandlerMap]: QueryAction<P, InferHandlerActionValue<THandlerMap[P]>>}>;

export type QueryFn<T> = (m: ShallowCopy<T>) => ShallowCopy<T> | null;

export type QueryChainFn<TValue> = 
    (value: ShallowCopy<TValue>, next: QueryFn<TValue>) => ShallowCopy<TValue> | null;

export type QueryActionHandler<TValue, TActionValue, TOptions extends object> = 
    (value: Immutable<TActionValue>, options: Immutable<TOptions>) => QueryChainFn<TValue>

export type QueryActionHandlerMap<
    TValue,
    TOptions extends object> = 
    { [key: string]: QueryActionHandler<TValue, unknown, TOptions> } ;