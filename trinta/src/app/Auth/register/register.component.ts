import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authServ = inject(AuthService);
  toastr= inject(ToastrService)
  user: User = new User();
  isFormSumbited= false
  router= inject(Router)
  handleSubmit(userForm) {
    this.authServ.register(userForm.value).subscribe({
      next: (response) => {
       // localStorage.setItem('access_token', response['accessToken']);
         this.toastr.success('Successful register!');
         this.router.navigateByUrl('/');
        console.log(response);
      },
      error: (err) => {
         this.toastr.error(err['error'].message);
        
        console.log('error', err['error'].message);
      },
    });
  }

}
