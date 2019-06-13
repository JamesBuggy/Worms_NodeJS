import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Alert, AlertType } from '../models/entities/alert'
 
@Injectable({ 
    providedIn: 'root' 
})
export class AlertService {
    
    private duration: number;
 
    constructor(private snackBar: MatSnackBar) {
        this.duration = 5000;
    }
 
    success(message: string): void {
        this.openSnackBar(new Alert(message, AlertType.Success));
    }
 
    error(message: string): void {
        this.openSnackBar(new Alert(message, AlertType.Error));
    }

    openSnackBar(alert: Alert) {
        this.snackBar.open(alert.message, 'Close', {
            duration: this.duration,
            panelClass: [`alert-${alert.type}`]
        });
    }
}