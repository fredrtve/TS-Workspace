import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonTypes } from '@shared-app/enums/button-types.enum';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { SearchBarConfig } from './search-bar-config.interface';

@Component({
  selector: 'app-search-bar',
  template: `
    <mat-toolbar class="search-bar" *ngIf="config" [appHide]="hidden">
      <div>
      
        <mat-icon>search</mat-icon>

        <input #searchInput appInputListener data-cy="search-bar-input"
            [placeholder]="config.placeholder" 
            [value]="config.initialValue || ''"
            (inputChanged)="handleSearchFn($event);">

        <ng-container *ngFor="let button of extraButtons || []">
          <mat-divider vertical=true></mat-divider>
          <app-button [config]="button | transformButton : baseSearchBtn">
          </app-button>
        </ng-container>
        
      </div>
    </mat-toolbar>
  `,
  styleUrls: ["./search-bar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent{
  @ViewChild('searchInput') searchInput: ElementRef<HTMLElement>;

  @Input() config: SearchBarConfig;
  @Input() extraButtons: AppButton[];

  private _hidden: boolean
  get hidden(): boolean { return this._hidden };

  @Input('hidden') set hidden(val: boolean) {
    if(!val && this._hidden) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.click();
      }, 50)
    }
    this._hidden = val;
  };

  baseSearchBtn: Partial<AppButton> = {type: ButtonTypes.Icon}

  handleSearchFn = (criteria: string): void => 
    this.config?.searchCallback(criteria);
}
