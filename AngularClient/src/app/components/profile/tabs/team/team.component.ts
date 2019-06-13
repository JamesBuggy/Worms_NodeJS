import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service'
import { TeamService } from '../../../../services/team.service'
import { Team } from '../../../../models/entities/team'
import { InputValidators } from 'src/app/common/inputValidators';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

    private profileOwner: string
    private form: FormGroup;
    private allowEdit: boolean;
    private team: Team;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private authService: AuthService,
                private teamService: TeamService,
                private inputValidators: InputValidators) {
                
        this.profileOwner = this.route.snapshot.paramMap.get('username');
    }

    ngOnInit(): void {
        var loggedInUser = this.authService.getLoggedInUser();
        if(loggedInUser && loggedInUser === this.profileOwner) {
            this.allowEdit = true;
        }
        this.getTeam(this.profileOwner);
    }

    getTeam(username: string): void {
        this.teamService.getTeam(username).subscribe(team => {
            this.team = team
            this.form = this.fb.group({
                teamName: [{ value:'', disabled: true }, this.inputValidators.teamName],
                wormName0: [{ value:'', disabled: true }, this.inputValidators.wormName],
                wormName1: [{ value:'', disabled: true }, this.inputValidators.wormName],
                wormName2: [{ value:'', disabled: true }, this.inputValidators.wormName],
                wormName3: [{ value:'', disabled: true }, this.inputValidators.wormName]
            });
        });
    }

    createTeam(): void {
        this.team = new Team();
        this.toggleFields();
    }

    saveTeam(): void {

        if(this.form.invalid) {
            return;
        }

        if(this.team.username) {
            this.teamService.updateTeam(this.team).subscribe((response: boolean) => { });
        }
        else {
            this.team.username = this.profileOwner;
            this.teamService.createTeam(this.team).subscribe((response: boolean) => { });
        }
        this.toggleFields();
    }

    editTeam(): void {
        this.toggleFields();
    }

    toggleFields(): void {
        if(this.form.disabled) {
            this.form.enable();
        }
        else {
            this.form.disable();
        }
    }
}
