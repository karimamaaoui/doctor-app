import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [   
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  editUser(userForm) {
    this.userService.updateUser(this.data.id, userForm.value).subscribe({
      next: (user) => {
        this.toastr.success('User updated successfully!');
        this.dialogRef.close(user); 
      //  console.log(user);
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      //  console.log('error', err.message);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
