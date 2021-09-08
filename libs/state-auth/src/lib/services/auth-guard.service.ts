import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AUTH_DEFAULT_REDIRECTS } from '../injection-tokens.const';
import { DefaultRedirects, StoreState } from '../interfaces';
import { Store } from 'state-management';
import { AuthActions } from '../state/actions.const';

/** Used to guard for unauthorized users. Provides both canActivate & canActivateChild
 * @remarks Use route data (see {@link AuthRouteData}) to set allowed roles for the guarded routes. 
 */
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private store: Store<StoreState>,
    private authService: AuthService,
    @Inject(AUTH_DEFAULT_REDIRECTS) private defaultRedirects: DefaultRedirects
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean  {
    return this.authCheck(route.data['allowedRoles']);
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean  {
    return this.authCheck(route.data['allowedRoles']);
  }

  private authCheck(allowedRoles: string[]): boolean{
    if(!this.authService.isAuthorized) {
      this.authService.logout();
      return false;
    }
    else if(this.authService.hasAccessTokenExpired)
      this.authService.refreshToken();
    
    if(allowedRoles){
      const currentUser = this.authService.getCurrentUser();
      if(currentUser && allowedRoles.indexOf(currentUser?.role) === -1){
        this.store.dispatch(AuthActions.unauthorized())
        this.router.navigate([this.defaultRedirects.home]);
        return false;    
      }
    }
  
    return true;
  }
}
