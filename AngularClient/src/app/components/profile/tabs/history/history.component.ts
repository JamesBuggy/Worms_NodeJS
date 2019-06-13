import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../../../services/match.service'
import { Match } from 'src/app/models/entities/match';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

    private displayedColumns: string[] = ['won', 'vs', 'score'];
    private dataSource = new MatTableDataSource();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private matchService: MatchService,
                private route: ActivatedRoute) {
        
    }

    ngOnInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        var user = this.route.snapshot.paramMap.get('username');
        this.getMatches(user);
    }

    getMatches(user: string): void {
        this.matchService.getMatchesForUser(user).subscribe((matches: Match[]) => {
            this.dataSource.data = matches
        });
    }
}
