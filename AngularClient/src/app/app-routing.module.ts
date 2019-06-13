import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServersComponent } from './components/servers/servers.component';
import { GameComponent } from './components/game/game.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HighScoresComponent } from './components/high-scores/high-scores.component';
import { ServerResolver } from './services/server-resolver.service';
import { AuthGuard } from './guards/authGuard';

const routes: Routes = [

  // Public routes
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'servers', component: ServersComponent},

  // Protected routes
  {path: 'game/:servername', component: GameComponent, canActivate: [AuthGuard], resolve: { serverInfo: ServerResolver }},
  {path: 'profiles', component: ProfilesComponent, canActivate: [AuthGuard]},
  {path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'highscores', component: HighScoresComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
  //{path: '**', component: PageNotFoundComponent} Add 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
