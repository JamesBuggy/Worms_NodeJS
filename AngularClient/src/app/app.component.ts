import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularClient';

  constructor(private router: Router,
              private deviceService: DeviceDetectorService) {
                
  }

  isIngame(): boolean {
    return this.router.url.includes('/game/');
  }

  isMobile(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }
}
