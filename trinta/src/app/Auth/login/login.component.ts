import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authServ = inject(AuthService);
  toastr = inject(ToastrService);
  user: User = new User();
  isFormSumbited = false;
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  isSuccessful = false;

  handleSubmit(userForm) {
    this.authServ.login(userForm.value).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('access_token', response['accessToken']);
        this.toastr.success('Successful login!');
        this.isSuccessful = true;
        const helper = new JwtHelperService();
        this.authServ.isLoggedIn = true;
        this.cdr.detectChanges();
        console.log("check status here",this.authServ.checkAuthStatus())

        const decodedToken =helper.decodeToken(response['accessToken']); 
        const userRole = decodedToken.UserInfo.role;
        const id = decodedToken.UserInfo.id
        console.log("user role",userRole)
        localStorage.setItem('userID', id);
        // Get the required roles from the route data
        if (userRole === 'ADMIN') {
          this.router.navigateByUrl('/dashboard');
        } else if (userRole === 'PATIENT') {
          this.router.navigateByUrl('/dashboard-patient');
        }
        
        else if (userRole === 'DOCTOR') {
          this.router.navigateByUrl('/doctor/dashboard');
        }else {
          this.router.navigateByUrl('/home');
        }
      },
      error: (err) => {
        this.toastr.error(err['error'].message);

        console.log('error', err['error'].message);
      },
    });
  }
}
