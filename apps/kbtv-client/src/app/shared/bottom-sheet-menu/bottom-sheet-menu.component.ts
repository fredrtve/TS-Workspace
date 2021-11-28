import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { _tryWithLogging } from "@fretve/global-utils";
import { BottomSheetAction } from './bottom-sheet-action.interface';

@Component({
  selector: 'app-bottom-sheet-menu',
  template:`

    <ng-container *ngFor="let action of actions">
      <a *ifRole="action.allowedRoles" (tap)="handleFn(action.callback, action.params)">
        <app-list-item>
          <mat-icon left-side>{{ action.icon }}</mat-icon>
          <span>{{ action.text }}</span>
        </app-list-item>
      </a>
    </ng-container>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomSheetMenuComponent {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public actions: BottomSheetAction[]) { }

  handleFn = (fn: Function, parameters: unknown[] = []) => {
    _tryWithLogging(() => fn(...parameters));
    this.close();
  };

  close = () => this._bottomSheetRef.dismiss(); 
}
