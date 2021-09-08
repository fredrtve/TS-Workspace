import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DispatchedActions, Effect, listenTo } from 'state-management';
import { AuthActions } from './actions.const';

@Injectable()
export class RedirectToUrlEffect implements Effect {

    constructor(private router: Router){}

    handle$(actions$: DispatchedActions) {
        return actions$.pipe(
            listenTo([AuthActions.loginSuccess]),
            map(x => { 
                if(x.action.returnUrl) this.router.navigateByUrl(x.action.returnUrl) 
                else this.router.navigate(["/"])
            }),
        )
    }
}