import { Compiler, Injectable, Injector } from '@angular/core';
import { ConfirmDialogService } from 'confirm-dialog';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'any' })
export class AppConfirmDialogService {
  
  dialog$: Observable<ConfirmDialogService> =
    of(null).pipe(
      switchMap(x => from(import('confirm-dialog'))),
      map(({ConfirmDialogModule, ConfirmDialogService}) => {
        const moduleFactory = this.compiler.compileModuleSync(ConfirmDialogModule);   
        const moduleInstance = moduleFactory.create(this.injector);
        return moduleInstance.injector.get(ConfirmDialogService);
      }),
      shareReplay()
    )

  constructor(
    private compiler: Compiler,
    private injector: Injector
  ) { }

}

