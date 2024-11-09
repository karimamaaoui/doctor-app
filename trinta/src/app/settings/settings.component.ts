import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../apps/icons/feathericons/feathericons.module';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [RouterOutlet, MatCardModule, RouterLinkActive, RouterLink, FeathericonsModule, MatButtonModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {}