import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { AuthService } from '../../Auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FeathericonsModule,
    FormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  authServ = inject(AuthService);
  toastr = inject(ToastrService);
  email: string;
  router = inject(Router);

  forgotPassword(forgotForm) {
    if (forgotForm.valid) {
      const formValue = { email: forgotForm.value.email };
      this.authServ.forgotPassword(formValue).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Check your email!');
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
