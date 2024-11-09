import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { AuthService } from '../../Auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgScrollbarModule, MatExpansionModule, RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule,CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    userRoles: string[] = [];
    private rolesSubscription: Subscription;

    constructor(
        private toggleService: ToggleService,private authService: AuthService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Mat Expansion
    panelOpenState = false;



    ngOnInit() {
        this.rolesSubscription = this.authService.getUserRoles().subscribe(roles => {
            this.userRoles = roles;
          });
        console.log("role",this.userRoles)
      }
    
      ngOnDestroy() {
        if (this.rolesSubscription) {
          this.rolesSubscription.unsubscribe();
        }
      }
    
      hasRole(role: string): boolean {
        return this.userRoles.includes(role);
      }
}