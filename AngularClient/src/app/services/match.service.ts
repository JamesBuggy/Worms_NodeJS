import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Network } from '../common/network'
import { Match } from '../models/entities/match';
import { GetMatchesResponse } from '../models/contracts/getMatchesResponse'

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient) {

  }

  getMatchesForUser(username: string): Observable<Match[]> {
    return this.http.get<GetMatchesResponse>(Network.getRestApiEndpoint()+'matches/'+username).pipe(
      map((response: GetMatchesResponse) => {
        return response.content;
     })
    );
  }

  getTopMatches(count: number): Observable<Match[]> {
    return this.http.get<GetMatchesResponse>(Network.getRestApiEndpoint()+'matches?top='+count).pipe(
      map((response: GetMatchesResponse) => {
        return response.content;
     })
    );
  }
}
