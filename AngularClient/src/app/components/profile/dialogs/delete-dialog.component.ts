import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProfileService } from '../../../services/profile.service'

@Component({
    selector: 'delete-dialog',
    templateUrl: 'delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialog {

    constructor(public dialogRef: MatDialogRef<DeleteDialog>,
                private profileService: ProfileService) { 

    }

    close(result): void {
        this.dialogRef.close(result)
    }
}