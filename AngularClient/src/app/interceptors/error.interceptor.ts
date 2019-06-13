// Followed:
// http://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial#login-component-ts

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service'
import { AlertService } from '../services/alert.service'
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
                private alertService: AlertService,
                private router: Router) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(catchError(err => {
            if (err.status === 401) {
                this.authService.logout();
            }
            const error = err.error.message || err.statusText;
            this.alertService.error(error);
            return throwError(error);
        }))
    }
}