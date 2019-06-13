import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Network } from '../common/network'
import { Team } from '../models/entities/team';
import { GetTeamResponse } from '../models/contracts/getTeamResponse'
import { ApiResponse } from '../models/contracts/apiResponse'
import { AlertService } from '../services/alert.service'

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient,
              private alertService: AlertService) { 

  }

  getTeam(username: string): Observable<Team> {
    return this.http.get<GetTeamResponse>(Network.getRestApiEndpoint()+'teams/'+username).pipe(
      map((response: GetTeamResponse) => {
        return response.content;
     })
    );
  }

  updateTeam(team: Team): Observable<boolean> {
    return this.http.put<ApiResponse>(Network.getRestApiEndpoint()+'teams/'+team.username, team).pipe(
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

  createTeam(team: Team): Observable<boolean> {
    return this.http.post<ApiResponse>(Network.getRestApiEndpoint()+'teams/'+team.username, team).pipe(
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
