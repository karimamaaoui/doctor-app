import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { UserService } from '../../Users/services/user.service';
import { AuthService } from '../../Auth/services/auth.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-account-settings',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, NgxEditorModule, MatDatepickerModule, MatSelectModule],
    providers: [provideNativeDateAdapter()],
    templateUrl: './account-settings.component.html',
    styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
    constructor( private userService: UserService, private authService : AuthService) {}
    currentUser: User;

    isEditing = false;

    // Text Editor
    editor: Editor;
    html = '';
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];


  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }


    ngOnInit(): void {
        this.editor = new Editor();
        const currentUser = this.authService.getCurrentClient();
        this.userService.getUserById(currentUser.id).subscribe(
            {
                next: user => {
                    this.currentUser = user;
                    console.log("user ",user)
                },
                error: error=>{
                    console.log("error",error)
                }
            }
        );
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
    }
  
    updateUser() {
        this.userService.updateUser(this.currentUser._id, this.currentUser).subscribe({
            next: response => {
                // Handle success response
                console.log('User updated successfully', response);
                this.toggleEditMode();
                
            },
            error: error => {
                // Handle error response
                console.error('Error updating user', error);
            }
        });
    }
    

}