declare let $: any;
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from '../app/common/header/toggle.service';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterOutlet, Router, NavigationCancel, NavigationEnd, RouterLink } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthService } from './Auth/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule,LandingPageComponent, RouterLink, SidebarComponent, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent {
    isLoggedIn: boolean = false;
    isToggled: boolean = false;
    routerSubscription: any;
    location: any;
  
    constructor(
      public router: Router,
      public toggleService: ToggleService,
      public authService: AuthService,
      private cdr: ChangeDetectorRef,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {
      this.toggleService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
      });
    }
  
    ngOnInit() {
      this.checkAuthStatus();
      if (isPlatformBrowser(this.platformId)) {
        this.recallJsFunctions();
      }
    }
  
    checkAuthStatus() {
      try {
        this.isLoggedIn = this.authService.checkAuthStatus();
        this.cdr.detectChanges(); // Manually trigger change detection
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }
    
    isLandingPage(): boolean {
      const url = this.router.url;
      return url === '/login' || url === '/register';
    }
  
    toggleTheme() {
      this.toggleService.toggleTheme();
    }
  
    toggle() {
      this.toggleService.toggle();
    }
  
    recallJsFunctions() {
      this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
        .subscribe(event => {
          this.location = this.router.url;
          if (event instanceof NavigationEnd) {
            this.checkAuthStatus(); // Ensure auth status is checked on every navigation end
            this.scrollToTop();
          }
        });
    }
  
    scrollToTop() {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    }
  }