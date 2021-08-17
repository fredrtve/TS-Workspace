import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogConfig } from './confirm-dialog-config.interface';

@Component({
  selector: 'lib-confirm-dialog',
  template: `
  <h2 *ngIf="config.title" mat-dialog-title>{{ config.title }}</h2>
  <div mat-dialog-content class="mat-body" *ngIf="config.message">
    {{ config.message || 'Vennligst bekreft operasjonen.' }}
  </div>
  <div mat-dialog-actions align="end">
    <button mat-button data-cy="dialog-cancel" 
      (click)="onNoClick()">{{ config.discardText || 'Avbryt'}}</button>
    <button mat-button data-cy="dialog-confirm" 
      [mat-dialog-close]="true" cdkFocusInitial>{{ config.confirmText }}</button>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ConfirmDialogConfig) {}

  onNoClick = (): void => this.dialogRef.close(false);
  
}


