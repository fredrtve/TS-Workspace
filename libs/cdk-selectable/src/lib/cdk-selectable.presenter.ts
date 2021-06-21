import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';
import { IdSelectPair, SelectedMap } from "./interfaces";

/**
 * Responsible for providing the view logic shared by the selectable components in the scope. 
 */
@Injectable()
export class CdkSelectablePresenter<TId extends string | number = string | number> {

    private selectedMapSubject = new BehaviorSubject<Readonly<SelectedMap<TId>>>({})

    /** An observable that emits the current selected status of all items 
     *  when a selected status changes. */
    selectedMap$ = this.selectedMapSubject.asObservable();

    /** Get the current select status of all items */
    get selectedMap(): SelectedMap<TId> { return  {...this.selectedMapSubject.value} };

    constructor(){}

    /** Get an observable emitting the selected status 
     *  when the selected status changes for a specified id.
     *  @param id - The id of the item you desire to observe */
    isSelected$ = (id: string | number): Observable<IdSelectPair<TId>> =>
        this.selectedMap$.pipe(
            map(x => x[id]), 
            filter(x => x !== undefined),
            distinctUntilKeyChanged<IdSelectPair<TId>>("selected")
        )

    /**
     * Update the selected status of a specified id
     * @param id - The id of the item that should be updated
     * @param selected - A new selected status for the item
     */
    updateEntry = (id: TId, selected: boolean) => this.addEntry(id, selected)
    
    /**
     * Add an item to keep track of its selected status. 
     * @param id - The id of the item that should be added
     * @param selected - An initial selected status for the item
     */
    addEntry = (id: TId, selected: boolean = false) => {
        this.selectedMapSubject.next({
            ...this.selectedMapSubject.value, 
            [id]: {id, selected: selected ? true : false}
        })
    }

    /**
     * Remove the specified item from the map
     * @param id - The id of the item that should be removed
     */
    removeEntry = (id: TId) => {
        if(!id) return;
        const copy = this.selectedMap;
        copy[id] = undefined;
        this.selectedMapSubject.next(copy)
    }

    /** Set the selected status of all items to false. */
    resetSelections(): void{
        const items = this.selectedMap;
        for(const key in items){ 
            const item = items[key];
            if(item) items[key] = {...item, selected: false}
        }
        this.selectedMapSubject.next(items);
    }
}