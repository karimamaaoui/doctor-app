import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxEditorModule } from 'ngx-editor';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';
import { UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [RouterLink,FormsModule, MatCardModule, MatButtonModule, MatMenuModule, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, NgxEditorModule, MatDatepickerModule, FileUploadModule, MatSelectModule, MatRadioModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  userServ = inject(UserService);
  toastr= inject(ToastrService)
  user: User = new User();

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  addUser(userForm) {
    this.userServ.addUser(userForm.value).subscribe({
      next: (user) => {
         this.toastr.success('user added Successful!');
         this.dialogRef.close(user); 
      //  console.log(user);
      },
      error: (err) => {
         this.toastr.error(err['error'].message);
        
       // console.log('error', err['error'].message);
      },
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}