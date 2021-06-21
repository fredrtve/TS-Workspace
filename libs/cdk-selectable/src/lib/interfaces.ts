
/** Represents an id and a selected status for the given id. */
export interface IdSelectPair<TId extends string | number = string | number> { 
    id: TId, 
    selected: boolean 
}

/** Represents a map of ids and associated {@link IdSelectPair}  */
export type SelectedMap<TId extends string | number = string | number> = 
    {[key: string]: IdSelectPair<TId> | undefined}
