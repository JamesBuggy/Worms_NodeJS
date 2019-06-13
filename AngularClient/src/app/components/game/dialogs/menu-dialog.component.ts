import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'menu-dialog',
    templateUrl: 'menu-dialog.component.html',
    styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialog {

    constructor(public dialogRef: MatDialogRef<MenuDialog>) { 

    }

    close(result): void {
        this.dialogRef.close(result)
    }
}