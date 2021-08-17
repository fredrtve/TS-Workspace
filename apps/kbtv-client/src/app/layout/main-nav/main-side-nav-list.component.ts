import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { MainNavService } from '../main-nav.service';
import { SideNavNavigations } from '../side-nav-navigations';

@Component({
  selector: 'app-main-side-nav-list',
  template: `
    <app-nav-item *ngFor="let navButton of navigations"
        [navButton]="navButton" (hasNavigated)="onNavClick()">
    </app-nav-item>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainSideNavListComponent {

  navigations: AppButton[] = SideNavNavigations;
  
  constructor(private mainNavService: MainNavService) { }

  onNavClick = () => this.mainNavService.isXs ? this.mainNavService.toggleDrawer() : null;
}
