import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LocalGamePageComponent } from './local-game-page/local-game-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'game', redirectTo: '/game/local', pathMatch: 'full'},
    { 
        path: 'game/local', 
        component: LocalGamePageComponent
    }
];
