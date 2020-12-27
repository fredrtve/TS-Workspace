import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class NoAuthGuard implements CanActivate {
  constructor(   
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    let returnUrl = route.queryParams['returnUrl'];  

    if(this.authService.isAuthorized){   
      if(returnUrl) this.router.navigateByUrl(returnUrl);
      else this.router.navigate(['/hjem']);
      return false;
    }

    return true;
  }
}