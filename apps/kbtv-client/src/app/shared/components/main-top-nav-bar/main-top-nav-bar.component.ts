import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceInfoService } from '@core/services/device-info.service';
import { ButtonTypes } from '@shared-app/enums/button-types.enum';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { _trackByAppButton } from '@shared-app/track-by-app-button';
import { Maybe } from '@fretve/global-types';
import { MainSkeletonRouteData } from '../main-skeleton/main-skeleton-route-data.interface';
import { MainTopNavConfig } from './main-top-nav.config';

@Component({
  selector: 'app-main-top-nav-bar',
  templateUrl: './main-top-nav-bar.component.html',
  styleUrls: ['./main-top-nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTopNavBarComponent {

  @Input() config: Maybe<MainTopNavConfig>;
  @Input() overlayMode: boolean;
  @Input() alwaysShowCancelButton: boolean;

  baseActionBtn: Partial<AppButton> = {type: ButtonTypes.Icon};

  get cancelButton(): AppButton {
    return {
      callback: this.config?.customCancelFn || this.onBack, 
      type: ButtonTypes.Icon,
      aria: 'Tilbake', 
      icon: 'close'
    }
  };

  get showCancelButton(): boolean {
    return this.config?.customCancelFn != null || this.alwaysShowCancelButton || this.deviceInfoService.isS || 
      (<MainSkeletonRouteData> this.route.snapshot.data).viewType === "overlay";
  } 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deviceInfoService: DeviceInfoService,
    private location: Location
  ) {}

  TrackByButton = _trackByAppButton

  private onBack = () => {
    const state = <{navigationId: number}> this.location.getState();
    if(state.navigationId !== 1) this.location.back(); 
    else this.router.navigate(['/'])
  }

}
