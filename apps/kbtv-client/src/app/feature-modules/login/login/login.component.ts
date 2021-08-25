import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceInfoService } from '@core/services/device-info.service';
import { LoadingService } from '@core/services/loading.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthReturnUrlQueryParam, AuthService, Credentials } from 'state-auth';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  isDemo: boolean = environment.demo;

  get returnUrl(): string{
    let url = this.route.snapshot.queryParams[AuthReturnUrlQueryParam]
    if(url === this.router.url.split('?')[0]) url = undefined;
    return url || this.route.snapshot.root.url.toString();
  }

  vm$: Observable<{isSmall: boolean, formDisabled: boolean}> = combineLatest([
    this.deviceInfoService.isXs$,
    this.deviceInfoService.isOnline$,
    this.loadingService.httpLoading$
  ]).pipe(map(([isSmall, isOnline, loading]) => { return {isSmall, formDisabled: !isOnline || loading}}))

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private deviceInfoService: DeviceInfoService,
    private loadingService: LoadingService,
  ) {}

  authenticate = (credentials: Credentials) =>
    this.authService.login(credentials, this.returnUrl);

}
