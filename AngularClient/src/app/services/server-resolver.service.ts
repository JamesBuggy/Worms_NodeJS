import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { concatMap  } from 'rxjs/operators';
import { ServerService } from './server.service'
import { AlertService } from './alert.service'
import { ServerInfo } from '../models/entities/serverInfo'
import { ServerAddr } from '../models/entities/serverAddr';

@Injectable({
  providedIn: 'root'
})
export class ServerResolver implements Resolve<ServerInfo> {

  constructor(private serverService: ServerService,
              private router: Router,
              private alertService: AlertService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<ServerInfo> | Observable<never> {
    let servername = route.paramMap.get('servername');
    return this.serverService.getServerAddress(servername).pipe(
      concatMap((serverAddr: ServerAddr) => {
        if(serverAddr) {
          return this.serverService.getServerInfo(serverAddr).pipe(
            concatMap((serverInfo: ServerInfo) => {
              if(serverInfo) {
                return of(serverInfo);
              }
              else {
                this.alertService.error('Could not contact server');
                this.router.navigate(['/servers']);
                return EMPTY;
              }
            })
          );
        } 
        else {
          this.alertService.error('Could not contact server');
          this.router.navigate(['/servers']);
          return EMPTY;
        }
      })
    );
  }
}
