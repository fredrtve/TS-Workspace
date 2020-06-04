import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { take, filter, switchMap } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from '../services/auth/auth.service';


@Injectable()

export class HttpRefreshTokenInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private authService:AuthService) {}

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { 
            Authorization: `Bearer ${token}`,
         }})
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        console.log(req.url);    
        if(this.isLoginRequest(req)) return next.handle(req); //Dont mess with login requests

        if(!this.authService.hasTokens()){ //If one or more tokens are missing, logout
            if(!this.isLogoutRequest(req)){ //Dont logout if request is logout (handled in auth service elsewhere)
                console.log(1, !!this.authService.hasTokens() && !this.isLoginRequest(req));
                return this.logoutUser(); 
            }else 
                return throwError('Cant log out without tokens')
        }
 
        //Dont handle expired tokens on refresh requests, nor if any token is missing.
        if(this.authService.hasAccessTokenExpired() && !this.isRefreshRequest(req)){
            console.log(2, this.authService.hasAccessTokenExpired() && !this.isRefreshRequest(req));               
            return this.handleTokenExpired$().pipe(switchMap(x =>{ return next.handle(this.addToken(req, x)) }));
        }  
        
        console.log(3, 'default');
        return next.handle(this.addToken(req, this.authService.getAccessToken()));
    }

    private handleTokenExpired$(): Observable<string>{
        if (!this.authService.isRefreshingToken) {
            return this.authService.refreshToken$().pipe(
                switchMap(tokens => {
                    if (tokens && tokens.accessToken && tokens.accessToken.token) {
                        this.tokenSubject.next(tokens.accessToken.token);
                        return tokens.accessToken.token;
                    }
                }));
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1));
        }
    }

    private logoutUser(): Observable<any> {
        this.authService.logout();
        return throwError("Noe gikk galt");
    }

    private isLoginRequest = (req: HttpRequest<any>) => req.url.includes("Auth/login");

    private isRefreshRequest = (req: HttpRequest<any>): boolean => req.url.includes("Auth/refresh");

    private isLogoutRequest = (req: HttpRequest<any>): boolean => req.url.includes("Auth/logout");
}