import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../services/auth.service'
import { ProfileService } from '../../services/profile.service'
import { Profile } from '../../models/entities/profile'
import { ImageDialog } from './dialogs/image-dialog.component'
import { DeleteDialog } from './dialogs/delete-dialog.component'
import { FormGroup, FormBuilder } from '@angular/forms';
import { InputValidators } from 'src/app/common/inputValidators';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    private profileOwner: string
    private allowEdit: boolean;
    private profile: Profile;
    private form: FormGroup;

    constructor(private route: ActivatedRoute, 
                private authService: AuthService,
                private profileService: ProfileService,
                private inputValidators: InputValidators,
                private dialog: MatDialog,
                private fb: FormBuilder) {

        this.profileOwner = this.route.snapshot.paramMap.get('username');
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [{ value:'', disabled: true }, this.inputValidators.realName],
            location: [{ value:'', disabled: true }, this.inputValidators.location],
            description: [{ value:'', disabled: true }, this.inputValidators.description]
        });
        var loggedInUser = this.authService.getLoggedInUser();
        if(loggedInUser && loggedInUser === this.profileOwner) {
            this.allowEdit = true;
        }
        this.getProfile(this.profileOwner);
    }

    getProfile(user: string): void {
        this.profileService.getProfile(user).subscribe((profile: Profile) => {
            this.profile = profile
        });
    }

    openImageDialog(): void {
        var dialogRef = this.dialog.open(ImageDialog);
        dialogRef.afterClosed().subscribe((result: string) => {
            if(result) {
                this.profile.image = result;
            }
        });
    }

    saveProfile(): void {
        if(this.form.invalid) {
            return;
        }
        this.profileService.updateProfile(this.profile).subscribe((response: Boolean) => { });
        this.toggleFields();
    }

    editProfile(): void {
        this.toggleFields();
    }

    deleteProfile(): void {
        var dialogRef = this.dialog.open(DeleteDialog);
        dialogRef.afterClosed().subscribe(result => {
            if(result && result === 'DELETE') {
                this.profileService.deleteProfile(this.profile.username).subscribe((response: boolean) => {
                    if(response) {
                        this.authService.logout();
                    }
                });
                this.toggleFields();
            }
        });
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
