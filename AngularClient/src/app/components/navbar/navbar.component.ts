import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
  }

  hideNavBar(): boolean {
    return this.isMobile() && this.router.url.includes('/game/');
  }

  isMobile(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }
}
