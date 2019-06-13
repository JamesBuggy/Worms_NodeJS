import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'weapon-dialog',
    templateUrl: 'weapon-dialog.component.html',
    styleUrls: ['./weapon-dialog.component.css']
})
export class WeaponDialog {

    constructor(public dialogRef: MatDialogRef<WeaponDialog>) { 

    }

    select(weapon): void {
        this.dialogRef.close(weapon)
    }
}