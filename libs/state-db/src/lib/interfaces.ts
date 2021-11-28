import { Immutable } from "@fretve/global-types";
import { StateAction } from "state-management";

/** Represents a key/value object with configurations of the db properties. */
export type StateDbConfig<TState> = { [key in keyof TState]: StatePropConfig }

export type MapFn<T, U = Partial<T>> = (value: Immutable<T>) => U

/** Supported storage types for persisting data */
export type StorageType = "localStorage" | "idb-keyval";

/** Represents a object with configurations for a state property that should be persisted by the db. */
export interface StatePropConfig {
    /** Choose which storage type that should be used to persist the given state property */
    storageType: StorageType;
    /** A mapping function that runs before value changes are persisted to the db.  */
    onPersistMapping?: MapFn<any, any>
}

/** Represents an action filter used to prevent certain state changes from being persisted. */
export type DbActionFilter = (action: StateAction) => boolean