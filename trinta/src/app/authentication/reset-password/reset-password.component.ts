import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FeathericonsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  // Password Hide
  hide = true;
  password: string;
  authServ = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  id: string;
  token: string;

  constructor() {
        // Extract the id and token from the route parameters

    this.route.params.subscribe((params) => {
        this.id = params['id'];
        this.token = params['token'];
      });
  }

  resetPassword(forgotForm) {
    if (forgotForm.valid) {
      const formValue = { password: forgotForm.value.password };
      this.authServ.resetPassword(this.id, this.token, formValue.password)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.toastr.success('Password updated succeffuly !');
            this.router.navigateByUrl('/login'); // Redirect after success
          },
          error: (err) => {
            this.toastr.error(err.error.message);
            console.log('forgot form', forgotForm.value);
            console.log('error', err.message);
          },
        });
    }
  }
}
