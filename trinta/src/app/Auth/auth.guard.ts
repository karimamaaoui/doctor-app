import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  const helper = new JwtHelperService();

  const router=inject(Router);
  const localToken = localStorage.getItem('access_token')
    if (localToken) {
    try {
      // Decode the token to extract user info
      const decodedToken =helper.decodeToken(localToken); 
      const userRole = decodedToken.UserInfo.role;
      
      // Get the required roles from the route data
      const requiredRoles = route.data['role'] || [];
      // Check if the user's role is included in the required roles
      if (requiredRoles.includes(userRole)) {
        return true;
      } else {
        router.navigateByUrl('/unauthorized'); 
        return false;
      }
    } catch (error) {
     // console.error('Token decoding failed', error);
      router.navigateByUrl('/login');
      return false;
    }
  } else {
    router.navigateByUrl('/login')
    return false;
  }
};

  
  


  