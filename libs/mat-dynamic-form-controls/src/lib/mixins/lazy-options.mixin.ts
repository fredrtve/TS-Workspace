import { AbstractControl } from '@angular/forms';
import { Immutable, Maybe } from '@fretve/global-types';
import { GenericAbstractControl } from '@fretve/dynamic-forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export type LazySelectOption = Maybe<"onPreset" | "all">;

const _shouldEagerOptions = (lazyOption: LazySelectOption, control: Maybe<AbstractControl>) => 
    control && (!lazyOption || (lazyOption === "onPreset" && !control.value)) && !control.disabled

export class WithLazyOptions {

    showOptionsSubject: BehaviorSubject<boolean>;

    resolveLazyOptions$<T>(
        control: GenericAbstractControl<any>, 
        options$: Observable<Immutable<Maybe<T[]>>>, 
        lazy$?: Observable<LazySelectOption>
    ): Observable<Immutable<Maybe<T[]>>> {
      return !lazy$ 
        ? options$ 
        : combineLatest([lazy$, this.showOptionsSubject.asObservable()]).pipe(
            map(([lazy, showOptions]) => showOptions || _shouldEagerOptions(lazy, <AbstractControl> control)),
            switchMap(showOptions => {
                const options = showOptions ? options$ : of(null)
                return options;
            }),
        )
    }
  
    showOptions(): void {
        this.showOptionsSubject.next(true)
    };

}