import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap, debounceTime } from "rxjs/operators";
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/entities/profile';

@Component({
    selector: 'app-profiles',
    templateUrl: './profiles.component.html',
    styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private form: FormGroup;
    private displayedColumns: string[] = ['img', 'username'];
    private dataSource = new MatTableDataSource();
    private autoCompleteResults: Observable<Profile[]>;

    constructor(private profileService: ProfileService,
                private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            search: ['', [Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9]*')]]
        });
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.autoCompleteResults = this.form
            .get('search')
            .valueChanges
            .pipe(
                debounceTime(300),
                switchMap(value => this.profileService.getProfiles(value))
            );
        this.getProfiles();
    }

    getProfiles(): void {
        const form = this.form.value;
        this.profileService.getProfiles(form.search).subscribe((profiles: Profile[]) => {
            this.dataSource.data = profiles
        });
    }
}
