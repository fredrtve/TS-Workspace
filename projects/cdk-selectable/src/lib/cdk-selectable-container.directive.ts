import { Directive, EventEmitter, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { SelectedMap } from "./interfaces";
import { CdkSelectablePresenter } from "./cdk-selectable.presenter";

/** Add to a element to make it a container component
 *  for selectable components that inherits from  the {@link CdkSelectableItemBaseComponent}. */
@Directive({selector: '[cdkSelectableContainer]', providers: [CdkSelectablePresenter]})
export class CdkSelectableContainerDirective {
    
    /** Emits an array of currently selected ids when an 
     *  item in the container changes its selected status. */
    @Output() selectionChanged = new EventEmitter<(string | number)[]>();

    private mapSub: Subscription;

    constructor(private presenter: CdkSelectablePresenter){
        this.mapSub = this.presenter.selectedMap$.subscribe(x => 
            this.selectionChanged.next(this._getSelectedIds(x))
        )
    }
    
    /** Get an array of the currently selected ids */
    getSelectedIds = (): (string | number)[] => 
        this._getSelectedIds(this.presenter.selectedMap);

    /** {@inheritdoc CdkSelectablePresenter.resetSelections} */
    resetSelections = (): void => this.presenter.resetSelections()
    
    ngOnDestroy(): void { this.mapSub?.unsubscribe() }

    private _getSelectedIds(map: SelectedMap): (string | number)[]{
        const ids = [];
        for(const key in map){
            const val = map[key];
            if(val !== undefined && val.selected === true) ids.push(key) 
        }
        return ids;
    }
}