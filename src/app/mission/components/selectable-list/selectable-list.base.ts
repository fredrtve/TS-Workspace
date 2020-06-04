import {
    Input,
    EventEmitter,
    Output,
  } from "@angular/core";
  import { skip, takeUntil } from "rxjs/operators";
import { SelectableListPresenter } from './selectable-list.presenter';
import { SubscriptionComponent } from 'src/app/shared/components/abstracts/subscription.component';
import { BaseEntity, SelectableEntity } from 'src/app/shared/interfaces';
  
  export abstract class SelectableListBase<T extends BaseEntity> extends SubscriptionComponent {
    @Input('entities')
    set entities(value: T[]) {this.selectableListPresenter.addEntities(value)}
  
    @Output() selectionChanged = new EventEmitter<number[]>();
  
    selectableEntities$ = this.selectableListPresenter.selectableEntities$;
  
    constructor(protected selectableListPresenter: SelectableListPresenter<T>) {super();}
    
    ngOnInit(): void {
        this.selectableListPresenter.selectedIds$.pipe(
            skip(1),
            takeUntil(this.unsubscribe)
        ).subscribe(x => this.selectionChanged.emit(x))
    }
  
    toggleSelect(selectable: SelectableEntity<T>) {
      this.selectableListPresenter.toggleEntity(selectable.entity.id)
    }
  
    clearSelections = () => this.selectableListPresenter.addSelections([]);
  
  }
  