import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { _tryWithLogging } from "global-utils";
import { ProfileAction } from './profile-action.interface';

@Component({
  selector: 'app-profile-action-item',
  template: `
    <app-list-item (click)="handleFn(action.callback, action.params)">
      <mat-icon left-side class="pl-2 pr-2">{{ action.icon }}</mat-icon>
      <div>{{ action.text }}</div>
      <div class="mat-caption" style="white-space:normal">
        {{ action.hint }}
      </div>
    </app-list-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionItemComponent {

    @Input() action: ProfileAction;

    handleFn = (fn: Function, parameters: unknown[] = []) => _tryWithLogging(() => fn(...parameters));
    
}

