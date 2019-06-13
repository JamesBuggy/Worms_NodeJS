import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { ServersComponent } from './components/servers/servers.component';
import { GameComponent } from './components/game/game.component';
import { MenuDialog } from './components/game/dialogs/menu-dialog.component';
import { WeaponDialog } from './components/game/dialogs/weapon-dialog.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ImageDialog } from './components/profile/dialogs/image-dialog.component';
import { DeleteDialog } from './components/profile/dialogs/delete-dialog.component';
import { TeamComponent } from './components/profile/tabs/team/team.component';
import { HistoryComponent } from './components/profile/tabs/history/history.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HighScoresComponent } from './components/high-scores/high-scores.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { StopFocusDirective } from './directives/stop-focus'
import { 
  NoWhitespaceDirective,
  TeamNameDirective,
  WormNameDirective,
  DescriptionDirective,
  RealNameDirective,
  LocationDirective
} from './directives/validation'

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { DeviceDetectorModule } from 'ngx-device-detector';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { 
  MatPaginatorModule, 
  MatSortModule, 
  MatTableModule, 
  MatInputModule,
  MatAutocompleteModule, 
  MatDialogModule, 
  MatTabsModule,
  MatGridListModule,
  MatSnackBarModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    ServersComponent,
    GameComponent,
    MenuDialog,
    WeaponDialog,
    ProfilesComponent,
    ProfileComponent,
    ImageDialog,
    DeleteDialog,
    LoginComponent,
    RegisterComponent,
    HighScoresComponent,
    TeamComponent,
    HistoryComponent,
    StopFocusDirective,
    NoWhitespaceDirective,
    TeamNameDirective,
    WormNameDirective,
    DescriptionDirective,
    RealNameDirective,
    LocationDirective,
    NavbarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatSnackBarModule,
    DeviceDetectorModule.forRoot()
  ],
  entryComponents: [
    MenuDialog,
    WeaponDialog,
    ImageDialog,
    DeleteDialog
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
