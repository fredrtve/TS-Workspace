import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { PreloadingStrategy } from '@angular/router';
import { CustomRoute } from '@shared-app/interfaces/custom-route.interface';
import { Maybe } from '@fretve/global-types';
import { EMPTY, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthRouteData, AuthService } from 'state-auth';

export interface PreloadRouteData extends AuthRouteData { preload?: boolean, preloadBreakpoints?: string[] }

@Injectable({ providedIn: 'root' })
export class RolePreloadService implements PreloadingStrategy {  

    constructor(
      private authService: AuthService,
      private breakpointObserver: BreakpointObserver
    ){ }

    preload(route: CustomRoute<PreloadRouteData>, load: () => Observable<unknown>): Observable<unknown> {
      const user = this.authService.getCurrentUser();
      if(!this.preloadCheck(route.data, user?.role)) return EMPTY;
      return timer(2000).pipe(switchMap(x => load()))
    }
  
    private preloadCheck(data: PreloadRouteData | undefined, role: Maybe<string>): boolean {
      return data === undefined ||
        ( 
          role != null && 
          (data.preloadBreakpoints === undefined || this.breakpointObserver.isMatched(data.preloadBreakpoints)) &&
          (data.preload === undefined || data.preload === true) && 
          (!data['allowedRoles'] || (data['allowedRoles'].indexOf(role) !== -1)
        )
      )
    }
  
}
