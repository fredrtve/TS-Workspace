import { Injectable } from '@angular/core';
import { fromEvent, Observable, merge, combineLatest, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';

export interface DeviceInfo {
  isOnline: boolean;
  isXs: boolean;
}

@Injectable({providedIn: 'root'})
export class DeviceInfoService {

  constructor(private breakpointObserver: BreakpointObserver) {
    //use navigator user agent for debugging with dev tools.
    const iphoneId = environment.production ? navigator.platform : navigator.userAgent;
    this.isIphone = /(iPad|iPhone)/g.test(iphoneId); 
  }

  get isOnline(): boolean { return navigator.onLine };

  isOnline$: Observable<boolean> = merge(
    fromEvent(window, 'offline'),
    fromEvent(window, 'online'),
    of(null)
  ).pipe(map(x => navigator.onLine));

  isIphone: boolean;

  isXs$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  isS$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  get isXs(): boolean { return this.breakpointObserver.isMatched(Breakpoints.XSmall) }

  get isS(): boolean { return this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small]) }

  deviceInfo$ = combineLatest([this.isOnline$, this.isXs$]).pipe(
    map(([isOnline, isXs])=> { return {isOnline, isXs} })
  )

  userLocation$: Observable<GeolocationPosition> = 
    new Observable((obs) => 
      navigator.geolocation.getCurrentPosition(
        (pos) => { obs.next(pos); obs.complete() },
        (err) => obs.error(err),
      )
    )
}
