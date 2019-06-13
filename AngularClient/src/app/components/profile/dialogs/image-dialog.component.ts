import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProfileService } from '../../../services/profile.service'

@Component({
    selector: 'image-dialog',
    templateUrl: 'image-dialog.component.html',
    styleUrls: ['./image-dialog.component.css']
})
export class ImageDialog implements OnInit {

    images: string[];

    constructor(public dialogRef: MatDialogRef<ImageDialog>,
                private profileService: ProfileService) { 

    }

    ngOnInit() : void{
        this.getImages();
    }

    getImages(): void {
        this.profileService.getProfileImages().subscribe(images => this.images = images);
    }

    close(result): void {
        this.dialogRef.close(result)
    }
}