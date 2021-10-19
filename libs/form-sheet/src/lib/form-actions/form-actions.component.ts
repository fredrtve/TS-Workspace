import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
  
  @Component({
    selector: 'lib-form-actions',
    templateUrl: './form-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FormActionsComponent {

    @Input() onlineRequired: boolean;
    @Input() submitDisabled: boolean;
    @Input() submitText: boolean;
    @Input() showReset?: boolean;
    @Input() resetDisabled?: boolean;
  
    @Output() reset = new EventEmitter();
    @Output() canceled = new EventEmitter();
    @Output() submitted = new EventEmitter();
  
    vm$: Observable<{isOnline: boolean}> = merge(
        fromEvent(window, 'offline'),
        fromEvent(window, 'online'),
        of(null)
      ).pipe(map(x => { return { isOnline: navigator.onLine } }));
  
    constructor() {}
  
    onSubmit = (isOnline: boolean) => ((!isOnline && this.onlineRequired) || this.submitDisabled) ? null : this.submitted.emit();
  }
  