import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogue-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './dialogue-auth.component.html',
  styleUrl: './dialogue-auth.component.scss'
})
export class DialogueAuthComponent {
  authServ = inject(AuthService);
  toastr = inject(ToastrService);
  user: User = new User();
  isFormSumbited = false;
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  constructor(public dialogRef: MatDialogRef<DialogueAuthComponent>) {}
  isSuccessful = false;

  onClose(): void {
    this.dialogRef.close(true);
  }

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
       this.onClose();
      },
      error: (err) => {
        this.toastr.error(err['error'].message);

        console.log('error', err['error'].message);
      },
    });
  }
 
}
