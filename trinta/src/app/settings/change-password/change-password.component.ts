import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { AuthService } from '../../Auth/services/auth.service';
import { UserService } from '../../Users/services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FeathericonsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  currentUser: User;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentClient();
    this.userService.getUserById(currentUser.id).subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('user ', user.password);
      },
      error: (error) => {
        console.log('error', error);
      },
    });
  }

  toggleHideOldPassword() {
    this.hideOldPassword = !this.hideOldPassword;
  }

  toggleHideNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleHideConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit(form) {
    
    if (form.valid && this.newPassword === this.confirmPassword) {
      this.userService
        .changePassword(
          this.currentUser._id,
          this.oldPassword,
          this.newPassword
        )
        .subscribe(
          (response) => {
            console.log(response);
            form.reset();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      console.log('Passwords do not match or form is invalid.');
    }
  }
}
