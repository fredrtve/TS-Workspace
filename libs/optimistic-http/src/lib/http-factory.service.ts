import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from "@angular/core";
import { Immutable, Maybe, UnknownState } from 'global-types';
import { Observable } from 'rxjs';
import { OPTIMISTIC_BASE_API_URL } from './constants/injection-tokens.const';
import { OptimisticHttpHeaders, OptimisticHttpRequest, SupportedContentTypes } from './interfaces';

@Injectable({providedIn: "root"})
export class HttpFactoryService {
  
    constructor(
      private httpClient: HttpClient,
      @Inject(OPTIMISTIC_BASE_API_URL) @Optional() private baseUrl?: string
    ) {}

    getObserver$(request: Immutable<OptimisticHttpRequest>): Observable<{isDuplicate?: boolean} | undefined> {
      const {method, headers, body, contentType, apiUrl} = request;
      const options: {headers: HttpHeaders} = { headers: new HttpHeaders(<OptimisticHttpHeaders> headers) }
      switch (method) {
        case "POST": return this.httpClient.post((this.baseUrl || '') + apiUrl, this.createHttpBody(body, contentType), options);
        case "PUT": return this.httpClient.put((this.baseUrl || '') + apiUrl, this.createHttpBody(body, contentType), options);
        case "DELETE": return this.httpClient.delete((this.baseUrl || '') + apiUrl, options);
      }
    }

    private createHttpBody(body: Maybe<{}>, contentType?: SupportedContentTypes) : Maybe<{}> | FormData {
      if(body == null) return null;
      
      if(contentType !== "formData") return body; 
    
      const formData = new FormData();

      for(const key in body) {
        const value = (<UnknownState> body)[key];
        if(value instanceof File) formData.append(key, value, value.name);
        else formData.append(key, this.getValueAsString(value))
      }

      return formData;   
    }

    private getValueAsString(value: unknown): string{
      if(value === null) return "";
      switch(typeof value){
          case "object": return JSON.stringify(value);
          case "string": return value;
          case "number": case "boolean": return value.toString();
          default: return ""
      }
    }
}