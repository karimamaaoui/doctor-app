import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(),
    provideHttpClient(withInterceptors([authInterceptor])),
    //provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync()],
  
};
