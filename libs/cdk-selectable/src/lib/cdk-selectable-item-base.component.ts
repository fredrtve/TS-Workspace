import { Directive, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IdSelectPair } from './interfaces';
import { CdkSelectablePresenter } from './cdk-selectable.presenter';

/** A base for a selectable component contained in an {@link CdkSelectableContainerDirective} */
@Directive()
export abstract class CdkSelectableItemBaseComponent<TId extends string | number = string | number> {

  /** A default selected state of the component */
  @Input() defaultState: boolean = false;

  private _id: TId;
  /**  Adds the unique idProp to the selection map in {@link CdkSelectablePresenter} */
  @Input('id') 
  set id(value: TId) {
    this._id = value;
    this.presenter.addEntry(this.id, this.defaultState)
  }
  /** Get a unique idProp value for the component to track the selected status. */
  get id(): TId { return this._id }

  constructor(private presenter: CdkSelectablePresenter) { }
  
  /** {@inheritdoc CdkSelectablePresenter.isSelected$} */
  isSelected$ = (id: TId): Observable<IdSelectPair> => 
    this.presenter.isSelected$(id);

  /** Toggle the selected status of the component */
  toggleSelection = () => 
    this.presenter.updateEntry(this.id, !this.presenter.selectedMap[this.id]?.selected);
  
  /** Clean up when the component is destroyed. */
  ngOnDestroy(): void {
    this.presenter.removeEntry(this.id);
  }
  
}
