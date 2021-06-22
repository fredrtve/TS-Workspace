import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Employer } from '@core/models';

@Component({
  selector: 'app-employer-list-item',
  template: `
    <app-list-item rippleDisabled=true *ngIf="employer">
        <mat-icon left-side class="pl-2 pr-2">work</mat-icon>
     
          <div>{{ employer.name }}</div>
 
          <span right-side>

            <a *ngIf="employer.phoneNumber" href="tel:{{ employer.phoneNumber }}">
              <button mat-icon-button color="accent"><mat-icon>phone</mat-icon></button>
            </a>
            
            <a *ngIf="employer.address" 
              href="https://www.google.com/maps/dir/?api=1&destination={{ employer.address }}&travelmode=driving"
              target="_blank">
              <button mat-icon-button color="accent">
                <mat-icon>directions_car</mat-icon>
              </button>  
            </a>
              
        </span>
      
    </app-list-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerListItemComponent {
  @Input() employer: Employer;
}