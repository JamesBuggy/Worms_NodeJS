import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { DeviceDetectorService } from 'ngx-device-detector';
import { ServerService } from '../../services/server.service';
import { ServerInfo } from '../../models/entities/serverInfo';
import { Common } from '../../common/common';

@Component({
    selector: 'app-servers',
    templateUrl: './servers.component.html',
    styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private form: FormGroup;
    private displayedColumns: string[] = ['name', 'state', 'playerCount', 'latency'];
    private dataSource = new MatTableDataSource();
    private servers: ServerInfo[];
    private autoCompleteResults: Observable<ServerInfo[]>;

    constructor(private serverService : ServerService,
                private fb: FormBuilder,
                private deviceService: DeviceDetectorService) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            search: ['']
        });
        this.servers = [];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.autoCompleteResults = this.form.get('search').valueChanges
            .pipe(map(value => this.servers.filter((server, index, self) => {
                return server.serverName.search(new RegExp(value, "i")) > -1 && 
                        Common.findIndexByProperty(self, "serverName", server.serverName) === index;
            })));
        this.getServers();
    }

    refresh(): void {
        this.servers = [];
        this.dataSource.data = this.servers;
        this.getServers();
    }

    search(): void {
        var form = this.form.value;
        var filteredList = this.servers.filter((server) => {
            return server.serverName.search(new RegExp(form.search, "i")) > -1;
        });
        this.dataSource.data = filteredList;
    }

    getServers(): void {
        this.serverService.getServerAddresses().subscribe(servers => {
            if(servers) {
                for(var i = 0; i < servers.length; i++) {
                    this.serverService.getServerInfo(servers[i]).subscribe(serverInfo => {
                        this.servers.push(serverInfo);
                        this.dataSource.data = this.servers;
                    })
                }
            }
        });
    }

    isMobile(): boolean {
        return this.deviceService.isMobile() || this.deviceService.isTablet();
    }

    enableFullscreen(): void {
        if(this.isMobile() && this.deviceService.browser === 'Firefox') {
            Common.enableFullscreen();
        }
    }
}
