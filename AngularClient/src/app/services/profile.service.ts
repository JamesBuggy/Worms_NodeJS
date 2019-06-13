import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Network } from '../common/network'
import { ApiResponse } from '../models/contracts/apiResponse'
import { GetProfilesResponse } from '../models/contracts/getProfilesResponse'
import { GetProfileResponse } from '../models/contracts/getProfileResponse'
import { GetProfileImagesResponse } from '../models/contracts/getProfileImagesResponse'
import { AlertService } from '../services/alert.service'
import { Profile } from '../models/entities/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public apiRoot = Network.getRestApiRoot();

  constructor(private http: HttpClient,
              private alertService: AlertService) { }

  getProfiles(search: string): Observable<Profile[]> {
    var url = Network.getRestApiEndpoint()+'profiles';
    if(search && search.trim() != '') {
      url = url + '?search='+search;
    }
    return this.http.get<GetProfilesResponse>(url).pipe(
      map((response: GetProfilesResponse) => {
        return response.content;
     })
    );
  }

  getProfile(name: string): Observable<Profile> {
    return this.http.get<GetProfileResponse>(Network.getRestApiEndpoint()+'profiles/'+name).pipe(
      map((response: GetProfileResponse) => {
        return response.content;
     })
    );
  }

  getProfileImages(): Observable<string[]> {
    return this.http.get<GetProfileImagesResponse>(Network.getRestApiEndpoint()+'images/').pipe(
      map((response: GetProfileImagesResponse) => {
        return response.content;
     })
    );
  }

  updateProfile(profile: Profile): Observable<boolean> {
    return this.http.put<ApiResponse>(Network.getRestApiEndpoint()+'profiles/'+profile.username, profile).pipe(
      map((response: ApiResponse) => {
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

  deleteProfile(name: string): Observable<boolean> {
    return this.http.delete<ApiResponse>(Network.getRestApiEndpoint()+'profiles/'+name).pipe(
      map((response: ApiResponse) => {
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
}