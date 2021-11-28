import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Maybe } from '@fretve/global-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AUTH_COMMAND_API_MAP } from '../injection-tokens.const';
import { AuthCommandApi, AuthCommandApiMap } from '../interfaces';

@Injectable({providedIn: 'root'})
export class AuthHttpFactoryService {

  constructor(
    private http: HttpClient,
    @Inject(AUTH_COMMAND_API_MAP) private commandApiMap: AuthCommandApiMap
  ) { }

  getObserver$<T>(action: keyof AuthCommandApiMap, payload: unknown): Observable<T> {
    const commandApi = <AuthCommandApi<unknown, T>> this.commandApiMap[action];
    if(!commandApi) console.error(`No api for action ${action}`);
    return this.getHttpObserver$<T>(commandApi, payload).pipe(map(x => this.format<T>(commandApi.responseFormatter, x)))
  }

  private getHttpObserver$<T>(commandApi: AuthCommandApi<unknown, T>, payload: unknown): Observable<T>{
    const body = this.format(commandApi.bodyFormatter, payload)
    switch (commandApi.method) {
      case "POST": return this.http.post<T>(commandApi.apiUrl, body);
      case "PUT": return this.http.put<T>(commandApi.apiUrl, body);
      case "GET": return this.http.get<T>(commandApi.apiUrl, { params: <HttpParams> body});
      default: throw `No match for method ${commandApi.method}`
    }
  }

  private format = <T>(formatter: Maybe<(a: unknown) => T>, payload: unknown): T =>
    formatter ? formatter(payload) : <T> payload

}
