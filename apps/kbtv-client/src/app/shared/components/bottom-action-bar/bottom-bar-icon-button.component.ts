import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { _tryWithLogging } from "global-utils";
import { BottomBarIconButton } from './bottom-bar-icon-button.interface';

@Component({
  selector: 'app-bottom-bar-icon-button',
  template: `
    <button *ngIf="config" mat-button [disabled]="config.disabled" 
        style="line-height:1;min-width:58px;padding: 4px;width:auto;border-radius:0;display:block"
        [attr.aria-label]="config.aria"
        (click)="handleFn(config.callback)">

        <mat-icon>{{ config.icon }}</mat-icon> 

        <span *ngIf="config.text" class="mat-caption" style="display:flex;justify-content: center;">
            {{ config.text }}
        </span>

    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarIconButtonComponent {

    @Input() config: BottomBarIconButton;

    constructor(){};

    handleFn = (fn: Function) => _tryWithLogging(() => fn());

}

