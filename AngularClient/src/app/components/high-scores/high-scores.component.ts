import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Common } from '../../common/common';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/entities/match';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.css']
})
export class HighScoresComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private form: FormGroup;
  private displayedColumns: string[] = ['username', 'vs', 'score'];
  private dataSource = new MatTableDataSource();
  private matches: Match[];
  private autoCompleteResults: Observable<Match[]>;

  constructor(private matchService : MatchService,
              private fb: FormBuilder) { 

  }

  ngOnInit(): void {
    this.form = this.fb.group({
        search: ['']
    });
    this.matches = [];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.autoCompleteResults = this.form.get('search').valueChanges
      .pipe(map(value => this.matches.filter((match, index, self) => {
          return match.username.search(new RegExp(value, "i")) > -1 && 
                  Common.findIndexByProperty(self, "username", match.username) === index;
      })));
    this.getMatches();
  }

  filterMatches(value): Match[] {
    return this.matches.filter((match) => {
      return match.username.search(new RegExp(value, "i")) > -1;
    })
  }

  refresh(): void {
      this.matches = [];
      this.dataSource.data = this.matches;
      this.getMatches();
  }

  search(): void {
      var form = this.form.value;
      var filteredList = this.matches.filter((match) => {
          return match.username.search(new RegExp(form.search, "i")) > -1;
      });
      this.dataSource.data = filteredList;
  }

  getMatches(): void {
    this.matchService.getTopMatches(200).subscribe((matches: Match[]) => {
      this.matches = matches;
      this.dataSource.data = this.matches;
    });
  }
}
