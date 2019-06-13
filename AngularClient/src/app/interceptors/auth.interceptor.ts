//  Followed:
//  https://blog.angular-university.io/angular-jwt-authentication/

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem("auth_token");

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token)
            });
            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}