import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppChip } from 'src/app/shared-app/interfaces/app-chip.interface';

@Component({
  selector: 'app-chips-bar',
  template: `
     <div class="horizontal-chips-container" *ngIf="chips && chips.length > 0">

        <mat-chip-list aria-orientation="horizontal" class="horizontal-chips">

        <mat-chip *ngFor="let chip of chips; trackBy: trackByChip" selected="true"
            [color]="chip.color || 'background'"
            [removable]="chip.onRemoved"  
            (click)="handleFn(chip.onClick)"
            (removed)="handleFn(chip.onRemoved)">   
            <span class="ellipsis">{{ chip.text }}</span>
            <mat-icon *ngIf="chip.onRemoved" matChipRemove>cancel</mat-icon>
        </mat-chip>

        </mat-chip-list>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsBarComponent{

  @Input() chips: AppChip[];

  trackByChip = (index: number, chip:AppChip) => chip.text;

  handleFn = (fn: Function): void => fn ? fn() : null;

}
