import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerAddr } from '../models/entities/serverAddr';
import { ServerInfo } from '../models/entities/serverInfo';
import { GetServerAddressesResponse } from '../models/contracts/getServerAddressesResponse';
import { GetServerAddressResponse } from '../models/contracts/getServerAddressResponse';
import { Network } from '../common/network'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {

  }

  getServerAddresses(): Observable<ServerAddr[]> {
    return this.http.get<GetServerAddressesResponse>(Network.getMasterServerEndpoint()+'servers').pipe(
      map((response: GetServerAddressesResponse) => {
        return response.content;
     })
    );
  }

  getServerAddress(name: string): Observable<ServerAddr> {
    return this.http.get<GetServerAddressResponse>(Network.getMasterServerEndpoint()+'servers/'+name).pipe(
      map((response: GetServerAddressResponse) => {
        return response.content;
     })
    );
  }

  getServerInfo(serverAddr: ServerAddr): Observable<ServerInfo> {
    var reqStartTime = new Date().getTime();
    return this.http.get<ServerInfo>(Network.getGameApiEndpoint(serverAddr.host, serverAddr.port)).pipe(
      map((serverInfo: ServerInfo) => {
        var reqEndTime = new Date().getTime();
        serverInfo.latency = (reqEndTime - reqStartTime)/2;
        serverInfo.serverAddr = serverAddr;
        return serverInfo;
     })
    );
  }
}
