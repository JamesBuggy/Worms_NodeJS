import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import * as moment from "moment";
import * as jwt_decode from "jwt-decode";
import { Network } from '../common/network'
import { LoginResponse } from '../models/contracts/loginResponse';
import { LoginRequest } from '../models/contracts/loginRequest';
import { RegisterResponse } from '../models/contracts/registerResponse';
import { RegisterRequest } from '../models/contracts/registerRequest';
import { ValidateFieldsRequest } from '../models/contracts/validateFieldsRequest';
import { ValidateFieldsResponse } from '../models/contracts/validateFieldsResponse';
import { ValidateFieldsResult } from '../models/entities/validateFieldsResult';
import { AlertService } from '../services/alert.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private router: Router,
              private alertService: AlertService) {

  }

  register(username: string, password: string): Observable<boolean> {
    var request = new RegisterRequest(username, password);
    return this.http.put<RegisterResponse>(Network.getRestApiEndpoint()+'registration', request).pipe(
      map((response: RegisterResponse) => {
        if(!response.success) {
          this.alertService.error(response.message);
        }
        else {
          this.alertService.success(response.message);
        }
        return response.success;
      })
    );
  }

  validateUsername(username: string): Observable<ValidateFieldsResult> {
    var request = new ValidateFieldsRequest();
    request.fields.username = username;
    return this.http.post<ValidateFieldsResponse>(Network.getRestApiEndpoint()+'registration', request).pipe(
      map((response: ValidateFieldsResponse) => {
        return response.content;
      })
    );
  }
  
  login(username: string, password: string): Observable<boolean> {
    var request = new LoginRequest(username, password);
    return this.http.post<LoginResponse>(Network.getRestApiEndpoint()+'login', request).pipe(
      map((response: LoginResponse) => {
        this.setSession(response.content);
        return response.success;
      })
    );
  }

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_expires");
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration(): moment.Moment {
    const expiration = localStorage.getItem("auth_expires");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getLoggedInUser(): string {
    if(this.isLoggedIn()) {
      var token = localStorage.getItem("auth_token");
      var decoded = jwt_decode(token);
      return decoded.sub;
    }
    else {
      return undefined;
    }
  }

  private setSession(authResult: LoginResponse["content"]): void {
    const expiresAt = moment().add(authResult.expires,'second');
    localStorage.setItem('auth_token', authResult.token);
    localStorage.setItem('auth_expires', JSON.stringify(expiresAt.valueOf()));
  }
}
