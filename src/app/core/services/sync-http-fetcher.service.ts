import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SyncModelState } from '@shared-app/const/sync-state.config';
import { SyncConfig, SyncHttpFetcher, SyncResponse } from '@sync/interfaces';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth';

@Injectable()
export class SyncHttpFetcherService implements SyncHttpFetcher<SyncModelState> {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  fetch$(config: SyncConfig, timestamp: number) : Observable<SyncResponse<SyncModelState>> {
    if(!this.authService.isAuthorized) return throwError("Unauthorized");

    let params = new HttpParams();

    params = params.set("initialNumberOfMonths", config?.initialNumberOfMonths);
    params = params.set("timestamp", timestamp?.toString());

    return this.apiService.get('/SyncAll', params);
  }
  
}